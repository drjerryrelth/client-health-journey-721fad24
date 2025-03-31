
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DripMessage {
  id: string;
  subject: string;
  content: string;
  day_number: number;
  is_read: boolean;
}

export const useClientDrip = () => {
  const { user } = useAuth();
  const [todaysDrip, setTodaysDrip] = useState<DripMessage | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTodaysDrip = async () => {
      try {
        if (!user) return;
        
        // Fetch the client's information to get their ID
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, start_date, program_id')
          .eq('user_id', user.id)
          .single();
          
        if (clientError || !clientData || !clientData.start_date || !clientData.program_id) {
          setLoading(false);
          return;
        }
        
        // Calculate current day of program
        const startDate = new Date(clientData.start_date);
        const currentDate = new Date();
        const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const currentDay = daysDiff + 1; // Day 1 is the first day
        
        // First try to get the client's message for today using direct query instead of RPC
        const { data: messageData, error: messageError } = await supabase
          .from('client_drip_messages')
          .select(`
            id,
            day_number,
            is_read,
            drip_template_id,
            drip_content_templates:drip_template_id (
              subject,
              content
            )
          `)
          .eq('client_id', clientData.id)
          .order('sent_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (!messageError && messageData) {
          // Fix: Access subject and content from the nested drip_content_templates object
          setTodaysDrip({
            id: messageData.id,
            subject: messageData.drip_content_templates?.subject,
            content: messageData.drip_content_templates?.content,
            day_number: messageData.day_number,
            is_read: messageData.is_read
          });
          setLoading(false);
          return;
        }
        
        // If no message is found, generate one via the edge function
        try {
          const { data, error } = await supabase.functions.invoke("generate-daily-drips", {
            body: { clientId: clientData.id }
          });
          
          if (!error && data?.message) {
            setTodaysDrip({
              id: data.id || 'new',
              subject: data.message.subject,
              content: data.message.content,
              day_number: currentDay,
              is_read: false
            });
          }
        } catch (error) {
          console.error("Error generating daily drip:", error);
        }
          
        setLoading(false);
      } catch (error) {
        console.error("Error fetching today's drip:", error);
        toast.error("Couldn't load today's message");
        setLoading(false);
      }
    };
    
    fetchTodaysDrip();
  }, [user]);
  
  const markAsRead = async () => {
    if (!todaysDrip || todaysDrip.id === 'new') return;
    
    try {
      // Update the is_read status directly instead of using RPC
      const { error } = await supabase
        .from('client_drip_messages')
        .update({ is_read: true })
        .eq('id', todaysDrip.id);
        
      if (error) throw error;
      
      setTodaysDrip({ ...todaysDrip, is_read: true });
      
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
  
  return { todaysDrip, loading, markAsRead };
};

export type { DripMessage };
