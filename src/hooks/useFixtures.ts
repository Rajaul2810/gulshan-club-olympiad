import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type Fixture = Database['public']['Tables']['fixtures']['Row'] & {
  team1?: { name: string };
  team2?: { name: string };
};

export function useFixtures() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFixtures();

    // Real-time subscription
    const channel = supabase
      .channel('fixtures-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fixtures' },
        () => {
          fetchFixtures(); // Refetch to get related data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchFixtures() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('fixtures')
        .select(`
          *,
          team1:team1_id(name),
          team2:team2_id(name)
        `)
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;
      setFixtures(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fixtures');
    } finally {
      setLoading(false);
    }
  }

  async function addFixture(
    fixtureData: Database['public']['Tables']['fixtures']['Insert']
  ) {
    try {
      const { data, error: insertError } = await supabase
        .from('fixtures')
        .insert([fixtureData])
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
      const { data, error: updateError } = await supabase
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
    loading,
    error,
    addFixture,
    updateFixture,
    deleteFixture,
    refetch: fetchFixtures,
  };
}

