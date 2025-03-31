import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ClientDataProvider from '@/components/client/ClientDataProvider';
import { ArrowRight, Calendar, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClientData } from '@/components/client/ClientDataProvider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import ProgramGuidelines from '@/components/programs/ProgramGuidelines';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProgramDetailsContent = () => {
  const { programName, clientStartDate, calculateProgress } = useClientData();
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
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{programName || "Your Program"}</CardTitle>
              {clientStartDate && (
                <CardDescription>
                  Started on {new Date(clientStartDate).toLocaleDateString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <ProgramProgressSection />
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Daily Requirements</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Track your meals using the check-in form</li>
                  <li>Drink at least 80-100 oz of water daily</li>
                  <li>Record your weight and measurements weekly</li>
                  <li>30 minutes of physical activity daily</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Upcoming Milestones</h3>
                <div className="space-y-3">
                  <MilestoneItem 
                    day={7} 
                    title="First Week Complete" 
                    description="Review your progress after one week" 
                  />
                  <MilestoneItem 
                    day={14} 
                    title="Two Week Check-in" 
                    description="Expect to see initial results" 
                  />
                  <MilestoneItem 
                    day={30} 
                    title="Program Complete" 
                    description="Final measurements and program review" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guidelines">
          {loading ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">Loading program guidelines...</p>
              </CardContent>
            </Card>
          ) : (
            <ProgramGuidelines programType={programType || ''} category={programCategory} />
          )}
        </TabsContent>
        
        <TabsContent value="supplements">
          <Card>
            <CardHeader>
              <CardTitle>Program Supplements</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplementsList supplements={supplements} programType={programType} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProgramProgressSection = () => {
  const { calculateProgress } = useClientData();
  const progressPercent = calculateProgress();
  
  return (
    <div>
      <h3 className="font-medium mb-3">Program Progress</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4">
        <Button asChild size="sm" variant="outline" className="gap-2">
          <Link to="/check-in">
            <Calendar size={16} /> Record Today's Check-in
          </Link>
        </Button>
      </div>
    </div>
  );
};

const MilestoneItem = ({ day, title, description }) => {
  const { clientStartDate } = useClientData();
  
  const isCompleted = () => {
    if (!clientStartDate) return false;
    
    const startDate = new Date(clientStartDate);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + day - 1);
    
    return new Date() > targetDate;
  };
  
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted() ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
        {day}
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

const SupplementsList = ({ supplements, programType }) => {
  if (supplements && supplements.length > 0) {
    return (
      <div className="space-y-3">
        {supplements.map((supplement, index) => (
          <div key={index} className="border-b pb-3 last:border-0">
            <h4 className="font-medium">{supplement.name}</h4>
            <p className="text-sm text-gray-600">{supplement.description}</p>
            <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
              <div>
                <span className="text-gray-500">Dosage:</span> {supplement.dosage}
              </div>
              <div>
                <span className="text-gray-500">Frequency:</span> {supplement.frequency}
              </div>
              {supplement.time_of_day && (
                <div>
                  <span className="text-gray-500">Time:</span> {supplement.time_of_day}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (programType === 'practice_naturals') {
    return (
      <div className="space-y-3">
        <div className="border-b pb-3">
          <h4 className="font-medium">Boost</h4>
          <p className="text-sm text-gray-600">Helps boost metabolism and energy</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> 1 dropper
            </div>
            <div>
              <span className="text-gray-500">Frequency:</span> 3x daily
            </div>
            <div>
              <span className="text-gray-500">Time:</span> Under the tongue
            </div>
          </div>
        </div>
        
        <div className="border-b pb-3">
          <h4 className="font-medium">Burn (optional)</h4>
          <p className="text-sm text-gray-600">Supports fat metabolism</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> 1 capsule
            </div>
            <div>
              <span className="text-gray-500">Time:</span> With breakfast, before 10am
            </div>
          </div>
        </div>
        
        <div className="border-b pb-3">
          <h4 className="font-medium">Cleanse</h4>
          <p className="text-sm text-gray-600">Supports digestive health</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> 1 capsule
            </div>
            <div>
              <span className="text-gray-500">Time:</span> With lunch and dinner
            </div>
          </div>
        </div>
        
        <div className="border-b pb-3">
          <h4 className="font-medium">Digest</h4>
          <p className="text-sm text-gray-600">Enhances nutrient absorption</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> 1 capsule
            </div>
            <div>
              <span className="text-gray-500">Time:</span> With lunch and dinner
            </div>
          </div>
        </div>
        
        <div className="border-b pb-3">
          <h4 className="font-medium">Suppress</h4>
          <p className="text-sm text-gray-600">Helps control appetite</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> 1 capsule
            </div>
            <div>
              <span className="text-gray-500">Time:</span> 1-2 hrs after lunch and dinner
            </div>
          </div>
        </div>
        
        <div className="border-b pb-3">
          <h4 className="font-medium">Reuv or Revive (optional)</h4>
          <p className="text-sm text-gray-600">Collagen supplement</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> As directed
            </div>
            <div>
              <span className="text-gray-500">Time:</span> Once daily, anytime
            </div>
          </div>
        </div>
        
        <div className="border-b pb-3">
          <h4 className="font-medium">V-Pro (optional)</h4>
          <p className="text-sm text-gray-600">Vegan protein shake</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> 1 scoop
            </div>
            <div>
              <span className="text-gray-500">Time:</span> Anytime
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium">Sweep (optional)</h4>
          <p className="text-sm text-gray-600">Detoxification support</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> As directed by Coach
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (programType === 'chirothin') {
    return (
      <div className="space-y-3">
        <div>
          <h4 className="font-medium">ChiroThin Drops</h4>
          <p className="text-sm text-gray-600">Proprietary formula for the ChiroThin program</p>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> 10 drops
            </div>
            <div>
              <span className="text-gray-500">Frequency:</span> 3x daily
            </div>
            <div>
              <span className="text-gray-500">Time:</span> Under the tongue
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <p className="text-sm text-gray-500 py-2">No supplements have been added to your program.</p>
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
