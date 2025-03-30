
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface RecentCheckInsProps {
  limit?: number;
}

const RecentCheckIns: React.FC<RecentCheckInsProps> = ({ limit = 5 }) => {
  // Mock check-in data
  const checkIns = [
    {
      id: '1',
      clientId: '1',
      clientName: 'Jane Cooper',
      date: 'Today, 9:30 AM',
      weight: 'Lost 0.5 lbs',
      mood: 'Great',
    },
    {
      id: '2',
      clientId: '4',
      clientName: 'Robert Brown',
      date: 'Today, 8:15 AM',
      weight: 'Lost 0.7 lbs',
      mood: 'Good',
    },
    {
      id: '3',
      clientId: '2',
      clientName: 'Michael Johnson',
      date: 'Yesterday',
      weight: 'No change',
      mood: 'Average',
    },
    {
      id: '4',
      clientId: '5',
      clientName: 'Olivia Thompson',
      date: '3 days ago',
      weight: 'Lost 1.2 lbs',
      mood: 'Great',
    },
    {
      id: '5',
      clientId: '3',
      clientName: 'Emma Wilson',
      date: '3 days ago',
      weight: 'Gained 0.3 lbs',
      mood: 'Poor',
    },
    {
      id: '6',
      clientId: '1',
      clientName: 'Jane Cooper',
      date: '4 days ago',
      weight: 'Lost 0.8 lbs',
      mood: 'Good',
    },
  ];

  const displayCheckIns = limit ? checkIns.slice(0, limit) : checkIns;

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'Great':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200" variant="outline">Great</Badge>;
      case 'Good':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200" variant="outline">Good</Badge>;
      case 'Average':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200" variant="outline">Average</Badge>;
      case 'Poor':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200" variant="outline">Poor</Badge>;
      default:
        return <Badge variant="outline">{mood}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {displayCheckIns.map((checkIn) => (
        <Link 
          key={checkIn.id}
          to={`/check-in/${checkIn.id}`}
          className="block"
        >
          <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${checkIn.clientName}`} alt={checkIn.clientName} />
              <AvatarFallback>{checkIn.clientName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{checkIn.clientName}</h4>
                <span className="text-xs text-gray-500">{checkIn.date}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">{checkIn.weight}</div>
              <div className="mt-2">
                {getMoodBadge(checkIn.mood)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentCheckIns;
