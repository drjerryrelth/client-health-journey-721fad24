
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDataProvider from '@/components/client/ClientDataProvider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import ProgramOverviewTab from '@/components/programs/tabs/ProgramOverviewTab';
import GuidelinesTab from '@/components/programs/tabs/GuidelinesTab';
import SupplementsTab from '@/components/programs/tabs/SupplementsTab';

const ProgramDetailsContent = () => {
  const { user } = useAuth();
  const [programType, setProgramType] = useState<string | null>(null);
  const [programCategory, setProgramCategory] = useState<string | null>(null);
  const [supplements, setSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClientProgramDetails = async () => {
      if (!user?.id) return;
      
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, program_id, program_category')
          .eq('user_id', user.id)
          .single();
          
        if (clientError) throw clientError;
        
        if (clientData && clientData.program_id) {
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('type, id')
            .eq('id', clientData.program_id)
            .single();
            
          if (programError) throw programError;
          
          if (programData) {
            setProgramType(programData.type);
            setProgramCategory(clientData.program_category);
            
            const { data: supplementsData, error: supplementsError } = await supabase
              .from('supplements')
              .select('*')
              .eq('program_id', programData.id);
              
            if (supplementsError) throw supplementsError;
            
            if (supplementsData) {
              setSupplements(supplementsData);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching program details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientProgramDetails();
  }, [user?.id]);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ProgramOverviewTab />
        </TabsContent>
        
        <TabsContent value="guidelines">
          <GuidelinesTab 
            loading={loading} 
            programType={programType} 
            programCategory={programCategory} 
          />
        </TabsContent>
        
        <TabsContent value="supplements">
          <SupplementsTab 
            supplements={supplements} 
            programType={programType} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ClientProgramDetails = () => {
  return (
    <ClientDataProvider>
      <ProgramDetailsContent />
    </ClientDataProvider>
  );
};

export default ClientProgramDetails;
