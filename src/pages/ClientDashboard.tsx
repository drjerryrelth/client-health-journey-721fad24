
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, BarChart2, Scale, Droplets, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import ClientDailyDrip from '@/components/client/ClientDailyDrip';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programName, setProgramName] = useState("");
  const [clientStartDate, setClientStartDate] = useState("");
  const [waterProgress, setWaterProgress] = useState(0);
  const [weightTrend, setWeightTrend] = useState('neutral');
  
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!user) return;
        
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select(`
            id,
            name,
            start_date,
            programs:program_id (name, duration)
          `)
          .eq('user_id', user.id)
          .single();
        
        if (clientError) throw clientError;
        
        if (clientData) {
          setClientStartDate(clientData.start_date);
          if (clientData.programs) {
            setProgramName(clientData.programs.name);
          }
          
          // Fetch check-ins for this client
          const { data: checkInsData, error: checkInsError } = await supabase
            .from('check_ins')
            .select('*')
            .eq('client_id', clientData.id)
            .order('date', { ascending: false })
            .limit(10);
            
          if (checkInsError) throw checkInsError;
          
          if (checkInsData && checkInsData.length > 0) {
            setCheckIns(checkInsData);
            
            // Calculate water progress from latest check-in
            const latestCheckIn = checkInsData[0];
            if (latestCheckIn.water_intake) {
              const waterIntake = latestCheckIn.water_intake;
              const waterTarget = 8; // 8 glasses as default target
              setWaterProgress(Math.min(100, (waterIntake / waterTarget) * 100));
            }
            
            // Calculate weight trend
            if (checkInsData.length >= 2) {
              const latest = checkInsData[0].weight;
              const previous = checkInsData[1].weight;
              
              if (latest < previous) {
                setWeightTrend('down');
              } else if (latest > previous) {
                setWeightTrend('up');
              } else {
                setWeightTrend('neutral');
              }
            }
          }
        }
        
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [user]);
  
  // Calculate progress percentage based on start date and program duration
  const calculateProgress = () => {
    if (!clientStartDate || !programName) return 0;
    
    const startDate = new Date(clientStartDate);
    const currentDate = new Date();
    const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
    const programDuration = 30; // Default to 30 days if not specified
    
    const progressPercent = Math.min(100, Math.max(0, (daysPassed / programDuration) * 100));
    return Math.round(progressPercent);
  };
  
  const progressPercent = calculateProgress();
  
  return (
    <div className="space-y-6">
      {/* Add daily drip message */}
      <ClientDailyDrip />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Program Progress</CardTitle>
          <CardDescription>
            {programName ? `${programName}` : "Your current program"}
            {clientStartDate && ` - Started ${new Date(clientStartDate).toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          
          <div className="mt-6">
            <Button asChild size="sm" className="gap-2">
              <Link to="/check-in">
                Record Today's Check-In <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Latest Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checkIns.length > 0 ? (
              <>
                {checkIns[0].weight && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Weight</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{checkIns[0].weight} lbs</span>
                      {weightTrend === 'down' && <ArrowDown className="h-4 w-4 text-green-500" />}
                      {weightTrend === 'up' && <ArrowUp className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                )}
                
                {checkIns[0].water_intake && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Water Intake</span>
                      </div>
                      <span className="text-sm">{checkIns[0].water_intake} glasses</span>
                    </div>
                    <Progress value={waterProgress} className="h-1" />
                  </div>
                )}
                
                <Separator />
                
                <div className="pt-2">
                  <span className="text-xs text-gray-500">
                    Last updated: {new Date(checkIns[0].date).toLocaleDateString()}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500 py-2">
                No check-ins recorded yet. Start tracking your progress!
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link to="/check-in">
                  <Scale className="h-5 w-5 mb-1" />
                  <span>Check-In</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex flex-col">
                <Link to="/client/program">
                  <BarChart2 className="h-5 w-5 mb-1" />
                  <span>My Program</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
