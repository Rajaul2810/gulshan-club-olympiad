import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type Club = Database['public']['Tables']['clubs']['Row'];

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClubs();

    // Real-time subscription
    const channel = supabase
      .channel('clubs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clubs' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setClubs((prev) => [...prev, payload.new as Club]);
          } else if (payload.eventType === 'UPDATE') {
            setClubs((prev) =>
              prev.map((club) =>
                club.id === payload.new.id ? (payload.new as Club) : club
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setClubs((prev) => prev.filter((club) => club.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchClubs() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('clubs')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setClubs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clubs');
    } finally {
      setLoading(false);
    }
  }

  async function addClub(clubData: Database['public']['Tables']['clubs']['Insert']) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: insertError } = await (supabase as any)
        .from('clubs')
        .insert([clubData])
        .select()
        .single();

      if (insertError) throw insertError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to add club',
      };
    }
  }

  async function updateClub(
    id: string,
    clubData: Database['public']['Tables']['clubs']['Update']
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase as any)
        .from('clubs')
        .update(clubData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to update club',
      };
    }
  }

  async function deleteClub(id: string) {
    try {
      const { error: deleteError } = await supabase
        .from('clubs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return { success: true, error: null };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete club',
      };
    }
  }

  return {
    clubs,
    loading,
    error,
    addClub,
    updateClub,
    deleteClub,
    refetch: fetchClubs,
  };
}

