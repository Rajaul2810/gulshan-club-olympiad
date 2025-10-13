import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type Result = Database['public']['Tables']['results']['Row'] & {
  fixture?: Database['public']['Tables']['fixtures']['Row'] & {
    team1?: { name: string };
    team2?: { name: string };
  };
  winner?: { name: string };
};

export function useResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();

    // Real-time subscription
    const channel = supabase
      .channel('results-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'results' },
        () => {
          fetchResults(); // Refetch to get related data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchResults() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('results')
        .select(`
          *,
          fixture:fixture_id(
            *,
            team1:team1_id(name),
            team2:team2_id(name)
          ),
          winner:winner_id(name)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setResults(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }

  async function addResult(
    resultData: Database['public']['Tables']['results']['Insert']
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: insertError } = await (supabase as any)
        .from('results')
        .insert([resultData])
        .select()
        .single();

      if (insertError) throw insertError;

      // Update fixture status to 'completed'
      await supabase
        .from('fixtures')
        .update({ status: 'completed' })
        .eq('id', resultData.fixture_id);

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

  async function deleteResult(id: string, fixtureId: string) {
    try {
      const { error: deleteError } = await supabase
        .from('results')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update fixture status back to 'scheduled'
      await supabase
        .from('fixtures')
        .update({ status: 'scheduled' })
        .eq('id', fixtureId);

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
    loading,
    error,
    addResult,
    updateResult,
    deleteResult,
    refetch: fetchResults,
  };
}

