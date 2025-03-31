
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircleHeart, Star } from 'lucide-react';
import type { DripMessage } from '@/hooks/client/useClientDrip';

interface DripMessageCardProps {
  message: DripMessage;
  onMarkAsRead: () => void;
}

const DripMessageCard: React.FC<DripMessageCardProps> = ({ message, onMarkAsRead }) => {
  return (
    <Card className="mb-6 border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg gap-2">
          <MessageCircleHeart size={20} className="text-primary" />
          <span>Today's Motivation</span>
          {!message.is_read && (
            <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium text-lg mb-2">{message.subject}</h3>
        <p className="text-gray-700">{message.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="text-xs text-gray-500">
          Day {message.day_number}
        </div>
        {!message.is_read && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMarkAsRead}
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

export default DripMessageCard;
