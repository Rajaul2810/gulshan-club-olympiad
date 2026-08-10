import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import { useEvent } from '@/contexts/EventContext';

type Media = Database['public']['Tables']['media']['Row'];

export function useMedia() {
  const { selectedEvent, isFallback, loading: eventLoading } = useEvent();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    if (eventLoading) return;

    try {
      setLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isFallback && selectedEvent?.id) {
        query = query.eq('event_id', selectedEvent.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setMedia(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch media');
    } finally {
      setLoading(false);
    }
  }, [eventLoading, isFallback, selectedEvent?.id]);

  useEffect(() => {
    fetchMedia();

    const channel = supabase
      .channel(`media-changes-${selectedEvent?.id || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media' },
        () => {
          fetchMedia();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMedia, selectedEvent?.id]);

  async function addMedia(mediaData: Database['public']['Tables']['media']['Insert']) {
    try {
      const payload = {
        ...mediaData,
        ...(!isFallback && selectedEvent?.id ? { event_id: selectedEvent.id } : {}),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: insertError } = await (supabase as any)
        .from('media')
        .insert([payload])
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase as any)
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
    loading: loading || eventLoading,
    error,
    addMedia,
    updateMedia,
    deleteMedia,
    refetch: fetchMedia,
  };
}
