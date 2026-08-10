'use client';

import { useState, useRef, useEffect } from 'react';
import { useEvent } from '@/contexts/EventContext';

interface YearSwitcherProps {
  variant?: 'public' | 'admin';
}

export default function YearSwitcher({ variant = 'public' }: YearSwitcherProps) {
  const { events, selectedEvent, year, setSelectedYear, loading } = useEvent();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (loading || !selectedEvent || events.length === 0) {
    return (
      <div
        className={`h-9 w-20 animate-pulse rounded-lg ${
          variant === 'admin' ? 'bg-white/10' : 'bg-white/10'
        }`}
      />
    );
  }

  const isAdmin = variant === 'admin';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
          isAdmin
            ? 'bg-white/10 text-white hover:bg-white/20'
            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
        }`}
        aria-label="Select Olympiad year"
      >
        <span>{year}</span>
        {selectedEvent.is_current && (
          <span className="rounded bg-orange-500/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
            Live
          </span>
        )}
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-white/20 bg-neutral-900 shadow-2xl ${
            isAdmin ? '' : ''
          }`}
        >
          <div className="border-b border-white/10 px-3 py-2 text-xs text-gray-400">
            Olympiad year
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {events.map((event) => (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedYear(event.year);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                    event.year === year
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <span>{event.year}</span>
                  <span className="text-xs text-gray-500">
                    {event.is_current ? 'Current' : event.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
