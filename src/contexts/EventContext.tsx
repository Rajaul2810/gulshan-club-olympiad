'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

export type EventRow = Database['public']['Tables']['events']['Row'];

const STORAGE_KEY = 'olympiad-selected-event-year';

const FALLBACK_EVENTS: EventRow[] = [
  {
    id: 'fallback-2025',
    year: 2025,
    slug: '2025',
    name: 'Olympiad 2025',
    is_current: false,
    status: 'archived',
    logo_url: null,
    registration_deadline: null,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-2026',
    year: 2026,
    slug: '2026',
    name: 'Olympiad 2026',
    is_current: true,
    status: 'live',
    logo_url: null,
    registration_deadline: null,
    created_at: '',
    updated_at: '',
  },
];

interface EventContextValue {
  events: EventRow[];
  selectedEvent: EventRow | null;
  currentEvent: EventRow | null;
  year: number;
  eventLabel: string;
  loading: boolean;
  error: string | null;
  isFallback: boolean;
  setSelectedYear: (year: number) => void;
  createEvent: (year: number, makeCurrent?: boolean) => Promise<{ data: EventRow | null; error: string | null }>;
  setCurrentEvent: (year: number) => Promise<{ error: string | null }>;
  refetch: () => Promise<void>;
}

const EventContext = createContext<EventContextValue | null>(null);

function pickDefaultEvent(events: EventRow[], storedYear: number | null): EventRow {
  if (storedYear != null) {
    const stored = events.find((e) => e.year === storedYear);
    if (stored) return stored;
  }
  return events.find((e) => e.is_current) || events[0];
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const applyEvents = useCallback((list: EventRow[], fallback = false) => {
    setEvents(list);
    setIsFallback(fallback);
    const storedRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const storedYear = storedRaw ? Number(storedRaw) : null;
    const next = pickDefaultEvent(list, Number.isFinite(storedYear) ? storedYear : null);
    setSelectedEvent(next);
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('year', { ascending: false });

      if (fetchError) throw fetchError;

      if (!data || data.length === 0) {
        applyEvents(FALLBACK_EVENTS, true);
        return;
      }

      applyEvents(data as EventRow[], false);
    } catch (err) {
      console.warn('Events table unavailable, using fallback years:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
      applyEvents(FALLBACK_EVENTS, true);
    } finally {
      setLoading(false);
    }
  }, [applyEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const setSelectedYear = useCallback(
    (year: number) => {
      const match = events.find((e) => e.year === year);
      if (!match) return;
      setSelectedEvent(match);
      localStorage.setItem(STORAGE_KEY, String(year));
    },
    [events]
  );

  const createEvent = useCallback(
    async (year: number, makeCurrent = false) => {
      if (isFallback) {
        return {
          data: null,
          error: 'Run EVENTS_MIGRATION.sql in Supabase before creating events.',
        };
      }

      try {
        if (makeCurrent) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('events')
            .update({ is_current: false })
            .eq('is_current', true);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: insertError } = await (supabase as any)
          .from('events')
          .insert([
            {
              year,
              slug: String(year),
              name: `Olympiad ${year}`,
              is_current: makeCurrent,
              status: makeCurrent ? 'live' : 'draft',
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        await fetchEvents();
        if (makeCurrent && data) {
          setSelectedYear(year);
        }

        return { data: data as EventRow, error: null };
      } catch (err) {
        return {
          data: null,
          error: err instanceof Error ? err.message : 'Failed to create event',
        };
      }
    },
    [fetchEvents, isFallback, setSelectedYear]
  );

  const setCurrentEvent = useCallback(
    async (year: number) => {
      if (isFallback) {
        return { error: 'Run EVENTS_MIGRATION.sql in Supabase first.' };
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('events')
          .update({ is_current: false, status: 'archived' })
          .neq('year', year);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from('events')
          .update({ is_current: true, status: 'live' })
          .eq('year', year);

        if (updateError) throw updateError;

        await fetchEvents();
        setSelectedYear(year);
        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : 'Failed to set current event',
        };
      }
    },
    [fetchEvents, isFallback, setSelectedYear]
  );

  const value = useMemo<EventContextValue>(
    () => ({
      events,
      selectedEvent,
      currentEvent: events.find((e) => e.is_current) || null,
      year: selectedEvent?.year ?? new Date().getFullYear(),
      eventLabel: selectedEvent?.name ?? `Olympiad ${new Date().getFullYear()}`,
      loading,
      error,
      isFallback,
      setSelectedYear,
      createEvent,
      setCurrentEvent,
      refetch: fetchEvents,
    }),
    [
      events,
      selectedEvent,
      loading,
      error,
      isFallback,
      setSelectedYear,
      createEvent,
      setCurrentEvent,
      fetchEvents,
    ]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvent() {
  const ctx = useContext(EventContext);
  if (!ctx) {
    throw new Error('useEvent must be used within EventProvider');
  }
  return ctx;
}
