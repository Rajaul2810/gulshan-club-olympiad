import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type Media = Database['public']['Tables']['media']['Row'];

export function useMedia() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();

    // Real-time subscription
    const channel = supabase
      .channel('media-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMedia((prev) => [payload.new as Media, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMedia((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? (payload.new as Media) : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setMedia((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMedia() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setMedia(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media');
    } finally {
      setLoading(false);
    }
  }

  async function addMedia(mediaData: Database['public']['Tables']['media']['Insert']) {
    try {
      const { data, error: insertError } = await supabase
        .from('media')
        .insert([mediaData])
        .select()
        .single();

      if (insertError) throw insertError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to add media',
      };
    }
  }

  async function updateMedia(
    id: string,
    mediaData: Database['public']['Tables']['media']['Update']
  ) {
    try {
      const { data, error: updateError } = await supabase
        .from('media')
        .update(mediaData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to update media',
      };
    }
  }

  async function deleteMedia(id: string, url?: string) {
    try {
      // Delete from storage if it's a photo
      if (url && url.includes('media-photos')) {
        const path = url.split('/media-photos/')[1];
        if (path) {
          await supabase.storage.from('media-photos').remove([path]);
        }
      }

      const { error: deleteError } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return { success: true, error: null };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete media',
      };
    }
  }

  return {
    media,
    loading,
    error,
    addMedia,
    updateMedia,
    deleteMedia,
    refetch: fetchMedia,
  };
}

