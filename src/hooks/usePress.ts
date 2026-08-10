import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';
import { useEvent } from '@/contexts/EventContext';

type Press = Database['public']['Tables']['press']['Row'];
type PressInsert = Database['public']['Tables']['press']['Insert'];

export const usePress = () => {
  const { selectedEvent, isFallback, loading: eventLoading } = useEvent();
  const [pressItems, setPressItems] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPressItems = useCallback(async (type?: 'press_release' | 'news') => {
    if (eventLoading) return;

    try {
      setLoading(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('press')
        .select('*')
        .order('publish_date', { ascending: false });

      if (!isFallback && selectedEvent?.id) {
        query = query.eq('event_id', selectedEvent.id);
      }

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPressItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [eventLoading, isFallback, selectedEvent?.id]);

  const addPressItem = async (pressData: {
    type: 'press_release' | 'news';
    title: string;
    image?: string;
    content?: string;
    author_name?: string;
    source?: string;
    news_link?: string;
    publish_date?: string;
  }) => {
    try {
      const insertData: PressInsert = {
        ...pressData,
        publish_date: pressData.publish_date || new Date().toISOString(),
        ...(!isFallback && selectedEvent?.id ? { event_id: selectedEvent.id } : {}),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: insertError } = await (supabase as any)
        .from('press')
        .insert([insertData])
        .select()
        .single();

      if (insertError) throw insertError;
      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to add press item',
      };
    }
  };

  const updatePressItem = async (id: string, updates: Partial<PressInsert>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: updateError } = await (supabase as any)
        .from('press')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setPressItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to update press item',
      };
    }
  };

  const deletePressItem = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: deleteError } = await (supabase as any)
        .from('press')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setPressItems((prev) => prev.filter((item) => item.id !== id));
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : 'Failed to delete press item',
      };
    }
  };

  const getPressReleases = () => {
    return pressItems.filter((item) => item.type === 'press_release');
  };

  const getNews = () => {
    return pressItems.filter((item) => item.type === 'news');
  };

  useEffect(() => {
    fetchPressItems();
  }, [fetchPressItems]);

  return {
    pressItems,
    loading: loading || eventLoading,
    error,
    addPressItem,
    updatePressItem,
    deletePressItem,
    fetchPressItems,
    getPressReleases,
    getNews,
    refetch: fetchPressItems,
  };
};
