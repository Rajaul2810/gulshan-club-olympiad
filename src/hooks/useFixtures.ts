import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import { useEvent } from '@/contexts/EventContext';

type Fixture = Database['public']['Tables']['fixtures']['Row'];

export function useFixtures() {
  const { selectedEvent, isFallback, loading: eventLoading } = useEvent();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFixtures = useCallback(async () => {
    if (eventLoading) return;

    try {
      setLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('fixtures')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isFallback && selectedEvent?.id) {
        query = query.eq('event_id', selectedEvent.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setFixtures(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fixtures');
    } finally {
      setLoading(false);
    }
  }, [eventLoading, isFallback, selectedEvent?.id]);

  useEffect(() => {
    fetchFixtures();

    const channel = supabase
      .channel(`fixtures-changes-${selectedEvent?.id || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fixtures' },
        () => {
          fetchFixtures();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFixtures, selectedEvent?.id]);

  async function addFixture(
    fixtureData: Database['public']['Tables']['fixtures']['Insert']
  ) {
    try {
      const payload = {
        ...fixtureData,
        ...(!isFallback && selectedEvent?.id ? { event_id: selectedEvent.id } : {}),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: insertError } = await (supabase as any)
        .from('fixtures')
        .insert([payload])
        .select()
        .single();

      if (insertError) throw insertError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to add fixture',
      };
    }
  }

  async function updateFixture(
    id: string,
    fixtureData: Database['public']['Tables']['fixtures']['Update']
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase as any)
        .from('fixtures')
        .update(fixtureData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to update fixture',
      };
    }
  }

  async function deleteFixture(id: string) {
    try {
      const { error: deleteError } = await supabase
        .from('fixtures')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return { success: true, error: null };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete fixture',
      };
    }
  }

  return {
    fixtures,
    loading: loading || eventLoading,
    error,
    addFixture,
    updateFixture,
    deleteFixture,
    refetch: fetchFixtures,
  };
}
