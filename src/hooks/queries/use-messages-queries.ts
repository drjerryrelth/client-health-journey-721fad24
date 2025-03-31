
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { checkAuthentication } from '@/services/clinics/auth-helper';
import { toast } from 'sonner';
import { Message } from '@/components/types/Message';

type MessageType = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
};

// Transform Supabase messages to our Message type
const transformMessages = (
  messages: MessageType[],
  currentUserId: string,
  coachName: string = 'Coach',
  clientName: string = 'You'
): Message[] => {
  return messages.map((msg) => ({
    id: msg.id,
    senderId: msg.sender_id,
    senderName: msg.sender_id === currentUserId ? clientName : coachName,
    message: msg.content,
    timestamp: msg.created_at,
    isRead: msg.is_read,
    // We could add avatar URLs here if available
    senderAvatar: msg.sender_id !== currentUserId ? 'https://i.pravatar.cc/150?img=44' : undefined,
  }));
};

export const useMessages = (coachId?: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          // When any change happens to messages table, invalidate the query
          queryClient.invalidateQueries({ queryKey: ['messages', coachId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coachId, queryClient]);

  // Get conversation between client and coach
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', coachId],
    queryFn: async () => {
      const session = await checkAuthentication();
      if (!session) return [];

      const currentUserId = session.user.id;
      
      if (!coachId) {
        // If no coachId is provided, just get the user's coaches
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('coach_id')
          .eq('user_id', currentUserId)
          .single();
          
        if (clientError) {
          console.error('Error fetching client coach:', clientError);
          setError('Could not find your coach information');
          return [];
        }
        
        if (!clientData?.coach_id) {
          setError('No coach assigned to your account');
          return [];
        }

        // Use the retrieved coach_id
        const coachUserId = clientData.coach_id;

        const { data, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .or(`sender_id.eq.${coachUserId},receiver_id.eq.${coachUserId}`)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          setError('Could not load messages');
          return [];
        }

        // Mark received messages as read
        const unreadMessages = data?.filter(
          msg => msg.receiver_id === currentUserId && !msg.is_read
        ) || [];

        if (unreadMessages.length > 0) {
          // Update read status for messages received by the current user
          unreadMessages.forEach(async (msg) => {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', msg.id);
          });
        }

        return transformMessages(data || [], currentUserId);
      } else {
        // Direct communication with a specific coach (client has coach_id)
        const { data, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .or(`sender_id.eq.${coachId},receiver_id.eq.${coachId}`)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          setError('Could not load messages');
          return [];
        }

        // Mark received messages as read
        const unreadMessages = data?.filter(
          msg => msg.receiver_id === currentUserId && !msg.is_read
        ) || [];

        if (unreadMessages.length > 0) {
          // Update read status for messages received by the current user
          unreadMessages.forEach(async (msg) => {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', msg.id);
          });
        }

        return transformMessages(data || [], currentUserId);
      }
    },
    enabled: !!coachId || true,
    // No need for aggressive polling since we're using real-time subscription now
    refetchInterval: 30000, // Just as a fallback, check every 30 seconds
  });

  // Send a new message
  const { mutate: sendMessage } = useMutation({
    mutationFn: async (content: string) => {
      const session = await checkAuthentication();
      if (!session) throw new Error('Not authenticated');

      const currentUserId = session.user.id;
      let receiverId: string | null = null;

      if (coachId) {
        receiverId = coachId;
      } else {
        // Find the client's coach
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('coach_id')
          .eq('user_id', currentUserId)
          .single();
          
        if (clientError || !clientData?.coach_id) {
          throw new Error('Could not determine your coach');
        }
        
        receiverId = clientData.coach_id;
      }

      if (!receiverId) {
        throw new Error('No message recipient found');
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', coachId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send message');
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};

// Export the hook
export default useMessages;
