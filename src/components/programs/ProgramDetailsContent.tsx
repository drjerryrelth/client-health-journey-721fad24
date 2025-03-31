
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgramDetails } from '@/hooks/queries/use-program-details';
import ProgramOverviewTab from '@/components/programs/tabs/ProgramOverviewTab';
import GuidelinesTab from '@/components/programs/tabs/GuidelinesTab';
import SupplementsTab from '@/components/programs/tabs/SupplementsTab';

const ProgramDetailsContent: React.FC = () => {
  const { programType, programCategory, supplements, loading } = useProgramDetails();
  
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

export default ProgramDetailsContent;
