import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string;
  program: string;
  program_id: string;
  progress: number;
  lastCheckIn: string;
  status: string;
}

interface CoachClientListProps {
  limit?: number;
}

const CoachClientList: React.FC<CoachClientListProps> = ({ limit }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCoachClients = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // Fetch clients assigned to this coach
        const { data, error } = await supabase
          .from('clients')
          .select(`
            id, 
            name, 
            email, 
            program_id,
            start_date,
            last_check_in,
            programs(name)
          `)
          .eq('coach_id', user.id)
          .order('name');
          
        if (error) throw error;
        
        // Transform data to match the expected format
        const formattedClients = data.map(client => {
          // Calculate a mock progress based on start date
          const startDate = new Date(client.start_date);
          const today = new Date();
          const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
          const progress = Math.min(Math.floor((daysSinceStart / 90) * 100), 100); // Assuming 90-day program
          
          // Determine status based on last check-in
          let status = 'active';
          if (client.last_check_in) {
            const lastCheckIn = new Date(client.last_check_in);
            const daysSinceCheckIn = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 3600 * 24));
            if (daysSinceCheckIn > 7) status = 'at risk';
            if (daysSinceCheckIn > 30) status = 'inactive';
          } else {
            status = 'inactive';
          }
          
          // Format last check-in display
          let lastCheckInDisplay = 'Never';
          if (client.last_check_in) {
            const lastCheckIn = new Date(client.last_check_in);
            const daysSinceCheckIn = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 3600 * 24));
            if (daysSinceCheckIn === 0) lastCheckInDisplay = 'Today';
            else if (daysSinceCheckIn === 1) lastCheckInDisplay = 'Yesterday';
            else if (daysSinceCheckIn < 7) lastCheckInDisplay = `${daysSinceCheckIn} days ago`;
            else lastCheckInDisplay = lastCheckIn.toLocaleDateString();
          }
          
          // Safely get program name - fixed TypeScript null check
          let programName = 'No Program';
          
          // Using type assertion with optional chaining to avoid null errors
          const programsObject = client.programs as { name?: string } | null;
          if (programsObject && 'name' in programsObject) {
            programName = programsObject.name || 'No Program';
          }
          
          return {
            id: client.id,
            name: client.name,
            email: client.email,
            program: programName,
            program_id: client.program_id,
            progress,
            lastCheckIn: lastCheckInDisplay,
            status
          };
        });
        
        setClients(formattedClients);
      } catch (error) {
        console.error('Error fetching coach clients:', error);
        toast.error('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoachClients();
  }, [user?.id]);

  const displayClients = limit ? clients.slice(0, limit) : clients;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'at risk':
        return 'bg-amber-100 text-amber-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }
  
  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No clients found. Add a client to get started.</p>
        <Link 
          to="/coach/clients?action=add" 
          className="inline-flex items-center mt-4 text-sm text-primary-600 hover:text-primary-800"
        >
          Add your first client
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Last Check-in</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <Link to={`/client/${client.id}`} className="flex items-center space-x-3 hover:underline">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`} alt={client.name} />
                    <AvatarFallback>{client.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-xs text-gray-500">{client.email}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{client.program}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${client.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium">{client.progress}%</span>
                </div>
              </TableCell>
              <TableCell>{client.lastCheckIn}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(client.status)} variant="outline">
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoachClientList;
