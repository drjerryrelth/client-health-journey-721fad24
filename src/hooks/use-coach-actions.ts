
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { Client } from '@/types';
import { toast } from 'sonner';

export function useCoachActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Add a client
  const addClient = async (clientData: Partial<Client>) => {
    if (!user?.id) {
      toast.error("You must be logged in to add clients");
      return null;
    }
    
    setIsLoading(true);
    try {
      // Ensure the client is assigned to the current coach
      const newClientData = {
        ...clientData,
        coachId: user.id,
        clinicId: user.clinicId || ''
      };
      
      // Here you would normally call an API to create the client
      console.log('Creating new client with data:', newClientData);
      
      toast.success("Client added successfully");
      return { id: 'temp-id', ...newClientData };
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error("Failed to add client");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Assign a program to a client
  const assignProgram = async (clientId: string, programId: string) => {
    if (!user?.id) {
      toast.error("You must be logged in to assign programs");
      return false;
    }
    
    setIsLoading(true);
    try {
      // Here you would normally call an API to assign the program
      console.log(`Assigning program ${programId} to client ${clientId}`);
      
      toast.success("Program assigned successfully");
      return true;
    } catch (error) {
      console.error('Error assigning program:', error);
      toast.error("Failed to assign program");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Review a check-in
  const reviewCheckIn = async (checkInId: string, feedback: string) => {
    if (!user?.id) {
      toast.error("You must be logged in to review check-ins");
      return false;
    }
    
    setIsLoading(true);
    try {
      // Here you would normally call an API to submit the review
      console.log(`Submitting review for check-in ${checkInId}: ${feedback}`);
      
      toast.success("Check-in reviewed successfully");
      return true;
    } catch (error) {
      console.error('Error reviewing check-in:', error);
      toast.error("Failed to submit review");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    addClient,
    assignProgram,
    reviewCheckIn
  };
}
