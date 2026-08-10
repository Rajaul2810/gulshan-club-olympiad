import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import { useEvent } from '@/contexts/EventContext';

type Result = Database['public']['Tables']['results']['Row'] & {
  winner?: { name: string; logo: string };
};

export function useResults() {
  const { selectedEvent, isFallback, loading: eventLoading } = useEvent();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (eventLoading) return;

    try {
      setLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('results')
        .select(`
          *,
          winner:winner_id(name, logo)
        `)
        .order('created_at', { ascending: false });

      if (!isFallback && selectedEvent?.id) {
        query = query.eq('event_id', selectedEvent.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setResults(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, [eventLoading, isFallback, selectedEvent?.id]);

  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel(`results-changes-${selectedEvent?.id || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'results' },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchResults, selectedEvent?.id]);

  async function addResult(
    resultData: Database['public']['Tables']['results']['Insert']
  ) {
    try {
      const payload = {
        ...resultData,
        ...(!isFallback && selectedEvent?.id ? { event_id: selectedEvent.id } : {}),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: insertError } = await (supabase as any)
        .from('results')
        .insert([payload])
        .select()
        .single();

      if (insertError) throw insertError;

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to add result',
      };
    }
  }

  async function updateResult(
    id: string,
    resultData: Database['public']['Tables']['results']['Update']
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase as any)
        .from('results')
        .update(resultData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to update result',
      };
    }
  }

  async function deleteResult(id: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: deleteError } = await (supabase as any)
        .from('results')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return { success: true, error: null };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete result',
      };
    }
  }

  return {
    results,
    loading: loading || eventLoading,
    error,
    addResult,
    updateResult,
    deleteResult,
    refetch: fetchResults,
  };
}
