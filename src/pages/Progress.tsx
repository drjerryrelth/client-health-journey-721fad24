
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/auth';
import { supabase } from '@/lib/supabase';
import WeightTrendsChart from '@/components/progress/WeightTrendsChart';
import MeasurementsTrendsChart from '@/components/progress/MeasurementsTrendsChart';
import NutrientComplianceChart from '@/components/progress/NutrientComplianceChart';
import ClientSelector from '@/components/progress/ClientSelector';

const Progress = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("weight");
  const [isLoading, setIsLoading] = useState(true);
  const [checkInsData, setCheckInsData] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);

  // Load data based on user role
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // For clients - load their own data
        if (user.role === 'client') {
          // First, get the client ID using the user's ID
          const { data: clientData } = await supabase
            .from('clients')
            .select('id')
            .eq('user_id', user.id)
            .single();
            
          if (clientData) {
            setSelectedClientId(clientData.id);
            
            // Fetch check-ins for this client
            const { data: checkIns } = await supabase
              .from('check_ins')
              .select('*')
              .eq('client_id', clientData.id)
              .order('date', { ascending: true });
              
            setCheckInsData(checkIns || []);
          }
        } 
        // For coaches - load their clients first
        else if (user.role === 'coach') {
          // Get coach ID first if not directly available
          let coachId = user.coach_id;
          
          if (!coachId) {
            const { data: coachData } = await supabase
              .from('coaches')
              .select('id')
              .eq('email', user.email)
              .single();
              
            coachId = coachData?.id;
          }
          
          if (coachId) {
            // Load coach's clients
            const { data: coachClients } = await supabase
              .from('clients')
              .select('*')
              .eq('coach_id', coachId);
              
            if (coachClients && coachClients.length > 0) {
              setClients(coachClients);
              
              // Select first client by default
              const firstClientId = coachClients[0]?.id;
              setSelectedClientId(firstClientId);
              
              // Load check-ins for first client
              if (firstClientId) {
                const { data: checkIns } = await supabase
                  .from('check_ins')
                  .select('*')
                  .eq('client_id', firstClientId)
                  .order('date', { ascending: true });
                  
                setCheckInsData(checkIns || []);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  // Handle client selection change (for coaches)
  const handleClientChange = async (clientId: string) => {
    if (clientId === selectedClientId) return;
    
    setSelectedClientId(clientId);
    setIsLoading(true);
    
    try {
      // Fetch check-ins for selected client
      const { data: checkIns } = await supabase
        .from('check_ins')
        .select('*')
        .eq('client_id', clientId)
        .order('date', { ascending: true });
        
      setCheckInsData(checkIns || []);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Progress Tracking</h1>
          <p className="text-gray-500">Track health and fitness metrics over time</p>
        </div>
        
        {/* Only show client selector for coaches */}
        {user?.role === 'coach' && clients.length > 0 && (
          <ClientSelector 
            clients={clients}
            selectedClientId={selectedClientId}
            onChange={handleClientChange}
          />
        )}
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="weight">Weight Trends</TabsTrigger>
          <TabsTrigger value="measurements">Body Measurements</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weight Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <WeightTrendsChart data={checkInsData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="measurements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Body Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <MeasurementsTrendsChart data={checkInsData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <NutrientComplianceChart data={checkInsData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Progress;
