
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircleHeart, Star } from 'lucide-react';
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

const ClientDailyDrip = () => {
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
        
        // First try to get the client's message for today
        const { data: messageData, error: messageError } = await supabase.rpc(
          'get_client_daily_drip',
          { client_id_param: clientData.id }
        );
        
        if (!messageError && messageData) {
          setTodaysDrip({
            id: messageData.id,
            subject: messageData.subject,
            content: messageData.content,
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
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user?.id)
        .single();
        
      if (!clientData) return;
      
      await supabase.rpc('mark_message_as_read', { 
        message_id_param: todaysDrip.id 
      });
        
      setTodaysDrip({ ...todaysDrip, is_read: true });
      
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
  
  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="py-6 text-center">
          <p className="text-gray-500">Loading today's message...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!todaysDrip) {
    return null; // Don't show anything if no message for today
  }
  
  return (
    <Card className="mb-6 border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg gap-2">
          <MessageCircleHeart size={20} className="text-primary" />
          <span>Today's Motivation</span>
          {!todaysDrip.is_read && (
            <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium text-lg mb-2">{todaysDrip.subject}</h3>
        <p className="text-gray-700">{todaysDrip.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="text-xs text-gray-500">
          Day {todaysDrip.day_number}
        </div>
        {!todaysDrip.is_read && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAsRead}
            className="flex items-center gap-1"
          >
            <Star size={16} />
            <span>Mark as Read</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClientDailyDrip;
