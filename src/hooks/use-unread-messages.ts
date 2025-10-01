import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { log } from '@/utils/browserLogger';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unread');

        if (error) throw error;
        setUnreadCount(count || 0);
      } catch (error) {
        log.error('Error fetching unread messages count:', error);
      }
    };

    fetchUnreadCount();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('contact_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages',
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return unreadCount;
};
