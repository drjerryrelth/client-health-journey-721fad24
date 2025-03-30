
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/components/types/Message';

// Temporary mock data
const initialMessages = [
  {
    id: '1',
    senderId: 'coach-1',
    senderName: 'Dr. Jessica Smith',
    senderAvatar: 'https://i.pravatar.cc/150?img=44',
    message: 'Hi there! How are you feeling after starting the new program?',
    timestamp: '2023-09-12T10:30:00Z',
    isRead: true
  },
  {
    id: '2',
    senderId: 'client-1',
    senderName: 'You',
    message: "I'm doing well! I've been following the meal plan and feel more energetic already.",
    timestamp: '2023-09-12T10:45:00Z',
    isRead: true
  },
  {
    id: '3',
    senderId: 'coach-1',
    senderName: 'Dr. Jessica Smith',
    senderAvatar: 'https://i.pravatar.cc/150?img=44',
    message: "That's great to hear! Have you experienced any challenges with the supplement schedule?",
    timestamp: '2023-09-12T11:00:00Z',
    isRead: true
  },
];

const ClientMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: `${Date.now()}`,
      senderId: 'client-1',
      senderName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // In a real app, we would also send this to an API
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="h-[calc(100vh-220px)] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          Messages
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.senderId === 'client-1' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`flex items-start gap-2 max-w-[80%] ${
                  msg.senderId === 'client-1' 
                    ? 'flex-row-reverse' 
                    : 'flex-row'
                }`}
              >
                <Avatar className="h-8 w-8">
                  {msg.senderAvatar ? (
                    <AvatarImage src={msg.senderAvatar} alt={msg.senderName} />
                  ) : (
                    <AvatarFallback>
                      <User size={16} />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div>
                  <div 
                    className={`px-4 py-2 rounded-lg text-sm ${
                      msg.senderId === 'client-1'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3">
        <div className="flex w-full items-center gap-2">
          <Textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            size="icon"
            disabled={!newMessage.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClientMessages;
