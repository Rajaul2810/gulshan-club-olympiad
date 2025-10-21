import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type Press = Database['public']['Tables']['press']['Row'];
type PressInsert = Database['public']['Tables']['press']['Insert'];

export const usePress = () => {
  const [pressItems, setPressItems] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPressItems = async (type?: 'press_release' | 'news') => {
    try {
      setLoading(true);
      let query = supabase
        .from('press')
        .select('*')
        .order('publish_date', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPressItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
        publish_date: pressData.publish_date || new Date().toISOString()
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('press')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Failed to add press item' 
      };
    }
  };

  const updatePressItem = async (id: string, updates: Partial<PressInsert>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('press')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setPressItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      );
      
      return { data, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Failed to update press item' 
      };
    }
  };

  const deletePressItem = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('press')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setPressItems(prev => prev.filter(item => item.id !== id));
      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : 'Failed to delete press item' 
      };
    }
  };

  const getPressReleases = () => {
    return pressItems.filter(item => item.type === 'press_release');
  };

  const getNews = () => {
    return pressItems.filter(item => item.type === 'news');
  };

  useEffect(() => {
    fetchPressItems();
  }, []);

  return {
    pressItems,
    loading,
    error,
    addPressItem,
    updatePressItem,
    deletePressItem,
    fetchPressItems,
    getPressReleases,
    getNews,
    refetch: fetchPressItems
  };
};
