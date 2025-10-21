import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (messageData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    try {
      const insertData: MessageInsert = {
        ...messageData,
        status: 'unread'
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('messages')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err.message : 'Failed to send message' 
      };
    }
  };

  const updateMessageStatus = async (id: string, status: 'read' | 'replied' | 'archived') => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, status } : msg
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message');
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    error,
    addMessage,
    updateMessageStatus,
    deleteMessage,
    refetch: fetchMessages
  };
};
