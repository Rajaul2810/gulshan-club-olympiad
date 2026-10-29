import { cpSync, copyFileSync, mkdirSync, rmSync } from 'node:fs';

const src = 'node_modules/pdfjs-dist';
const dest = 'public/pdfjs';

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
copyFileSync(`${src}/build/pdf.worker.min.mjs`, `${dest}/pdf.worker.min.mjs`);
for (const dir of ['cmaps', 'standard_fonts', 'wasm', 'iccs']) {
  cpSync(`${src}/${dir}`, `${dest}/${dir}`, { recursive: true });
}
