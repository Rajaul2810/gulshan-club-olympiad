'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PageFlip } from 'page-flip';

interface RulesBookProps {
  file: string;
  title: string;
}

type Status = 'downloading' | 'ready' | 'error';

const RENDER_WIDTH = 1100;

function createPageElement(index: number, total: number) {
  const page = document.createElement('div');
  page.className = 'relative bg-white overflow-hidden';
  if (index === 0 || index === total - 1) page.dataset.density = 'hard';

  const placeholder = document.createElement('div');
  placeholder.className = 'absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-400 text-sm';
  placeholder.innerHTML = `<span class="w-8 h-8 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin"></span>Loading page ${index + 1}…`;

  page.append(placeholder);
  return { page, placeholder };
}

function showPageImage(page: HTMLElement, placeholder: HTMLElement, src: string, index: number) {
  const img = document.createElement('img');
  img.src = src;
  img.alt = `Page ${index + 1}`;
  img.className = 'absolute inset-0 w-full h-full object-contain select-none';
  img.draggable = false;
  page.append(img);
  placeholder.remove();
}

export default function RulesBook({ file, title }: RulesBookProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const currentRef = useRef(0);

  const [status, setStatus] = useState<Status>('downloading');
  const [download, setDownload] = useState(0);
  const [rendered, setRendered] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [landscape, setLandscape] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const blobUrls: string[] = [];
    let task: import('pdfjs-dist').PDFDocumentLoadingTask | null = null;
    // page-flip removes its root element on destroy, so it gets its own node outside React's tree
    const bookEl = document.createElement('div');
    host.appendChild(bookEl);

    setStatus('downloading');
    setDownload(0);
    setRendered(0);
    setPage(0);
    currentRef.current = 0;

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

        task = pdfjs.getDocument({
          url: file,
          cMapUrl: '/pdfjs/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/pdfjs/standard_fonts/',
          wasmUrl: '/pdfjs/wasm/',
          iccUrl: '/pdfjs/iccs/',
        });
        task.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
          if (total) setDownload(Math.min(100, Math.round((loaded / total) * 100)));
        };
        const pdf = await task.promise;
        if (cancelled) return;

        const total = pdf.numPages;
        const firstViewport = (await pdf.getPage(1)).getViewport({ scale: 1 });
        const ratio = firstViewport.height / firstViewport.width;

        const pages = Array.from({ length: total }, (_, i) => createPageElement(i, total));
        pages.forEach((p) => bookEl.appendChild(p.page));

        const { PageFlip } = await import('page-flip');
        if (cancelled) return;

        const baseWidth = 550;
        const flip = new PageFlip(bookEl, {
          width: baseWidth,
          height: Math.round(baseWidth * ratio),
          size: 'stretch',
          minWidth: 260,
          maxWidth: 1000,
          minHeight: Math.round(260 * ratio),
          maxHeight: Math.round(1000 * ratio),
          showCover: true,
          usePortrait: true,
          mobileScrollSupport: false,
          maxShadowOpacity: 0.5,
          flippingTime: 700,
        });
        flip.loadFromHTML(pages.map((p) => p.page));
        flip.on<number>('flip', (e) => {
          currentRef.current = e.data;
          setPage(e.data);
        });
        flip.on<string>('changeOrientation', (e) => setLandscape(e.data === 'landscape'));
        flipRef.current = flip;

        setPageCount(total);
        setLandscape(flip.getOrientation() === 'landscape');
        setStatus('ready');

        const done = new Set<number>();
        // Render the page nearest to where the reader is, so flipping ahead feels instant
        const nextPage = () => {
          const cur = currentRef.current;
          for (let d = 0; d < total; d++) {
            for (const i of [cur + d, cur - d]) {
              if (i >= 0 && i < total && !done.has(i)) return i;
            }
          }
          return -1;
        };

        for (let i = nextPage(); i !== -1 && !cancelled; i = nextPage()) {
          done.add(i);
          const pdfPage = await pdf.getPage(i + 1);
          const viewport = pdfPage.getViewport({ scale: RENDER_WIDTH / pdfPage.getViewport({ scale: 1 }).width });
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(viewport.width);
          canvas.height = Math.round(viewport.height);
          await pdfPage.render({ canvas, viewport }).promise;
          const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
          pdfPage.cleanup();
          if (cancelled || !blob) break;

          const url = URL.createObjectURL(blob);
          blobUrls.push(url);
          showPageImage(pages[i].page, pages[i].placeholder, url, i);
          setRendered(done.size);
        }
        void task?.destroy();
      } catch (err) {
        console.error('Rules PDF failed to load:', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      void task?.destroy();
      try {
        flipRef.current?.destroy();
      } catch {
        bookEl.remove();
      }
      flipRef.current = null;
      blobUrls.forEach(URL.revokeObjectURL);
      if (host.contains(bookEl)) bookEl.remove();
    };
  }, [file]);

  const prev = useCallback(() => flipRef.current?.flipPrev(), []);
  const next = useCallback(() => flipRef.current?.flipNext(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    const onFs = () => setIsFullscreen(document.fullscreenElement === shellRef.current);
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, [prev, next]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else shellRef.current?.requestFullscreen?.();
  };

  const pageLabel = () => {
    if (!pageCount) return '';
    const isSpread = landscape && page > 0 && page < pageCount - 1;
    return isSpread ? `Pages ${page + 1}–${Math.min(page + 2, pageCount)} of ${pageCount}` : `Page ${page + 1} of ${pageCount}`;
  };

  const btn =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:pointer-events-none';

  return (
    <div
      ref={shellRef}
      className={`relative rounded-3xl border border-white/15 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 shadow-2xl ${
        isFullscreen ? 'flex flex-col justify-center p-4 sm:p-8 rounded-none' : 'p-3 sm:p-8'
      }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="min-w-0">
          <p className="text-white font-semibold truncate">{title}</p>
          <p className="text-gray-400 text-xs">
            {status === 'ready'
              ? rendered < pageCount
                ? `${pageLabel()} · preparing pages ${rendered}/${pageCount}`
                : pageLabel()
              : status === 'downloading'
                ? `Loading brochure… ${download}%`
                : 'Could not open the brochure'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={toggleFullscreen} className={`${btn} bg-white/10 text-white hover:bg-white/20`} disabled={status !== 'ready'}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <a href={file} target="_blank" rel="noopener noreferrer" className={`${btn} bg-white/10 text-white hover:bg-white/20`}>
            Open PDF
          </a>
          <a
            href={file}
            download
            className={`${btn} bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      {/* Book */}
      <div className="relative">
        {status === 'downloading' && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-300">
            <div className="w-14 h-14 border-4 border-white/15 border-t-orange-500 rounded-full animate-spin" />
            <div className="w-64 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all" style={{ width: `${download}%` }} />
            </div>
            <p className="text-sm">Opening the rules book… {download}%</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-20 px-4">
            <p className="text-red-300 mb-4">The brochure could not be displayed in this browser.</p>
            <a href={file} download className={`${btn} bg-gradient-to-r from-orange-500 to-pink-500 text-white`}>
              Download PDF instead
            </a>
          </div>
        )}

        <div
          className="mx-auto max-w-5xl"
          style={isFullscreen ? { maxWidth: 'min(100%, calc((100vh - 11rem) * 1.45))' } : undefined}
        >
          <div ref={hostRef} />
        </div>
      </div>

      {/* Page controls */}
      {status === 'ready' && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={prev} disabled={page === 0} className={`${btn} bg-white/10 text-white hover:bg-white/20`} aria-label="Previous page">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <span className="min-w-[8rem] text-center text-sm text-gray-300">{pageLabel()}</span>
          <button
            onClick={next}
            disabled={page >= pageCount - (landscape && page > 0 ? 2 : 1)}
            className={`${btn} bg-white/10 text-white hover:bg-white/20`}
            aria-label="Next page"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      {status === 'ready' && (
        <p className="mt-3 text-center text-xs text-gray-500">Tip: drag a page corner, swipe, or use the arrow keys to turn pages.</p>
      )}
    </div>
  );
}
