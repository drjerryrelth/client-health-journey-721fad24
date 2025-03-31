
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ClientDataProvider from '@/components/client/ClientDataProvider';
import { ArrowRight, Calendar, Info, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClientData } from '@/components/client/ClientDataProvider';

const ProgramDetailsContent = () => {
  const { programName, clientStartDate, calculateProgress } = useClientData();
  
  return (
    <div className="space-y-6">
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
              <li>Drink at least 64oz of water daily</li>
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
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Program Supplements</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplementsList />
        </CardContent>
      </Card>
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
  
  // Calculate if this milestone is completed
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

const SupplementsList = () => {
  // In a real app, this would fetch supplements from the API
  const supplements = [
    { name: "Daily Multivitamin", dosage: "1 capsule", frequency: "Once daily", timeOfDay: "Morning" },
    { name: "Omega-3", dosage: "2 capsules", frequency: "Once daily", timeOfDay: "With meal" },
    { name: "Protein Shake", dosage: "1 scoop", frequency: "As needed", timeOfDay: "Post-workout" },
  ];
  
  if (supplements.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-2">No supplements have been added to your program.</p>
    );
  }
  
  return (
    <div className="space-y-3">
      {supplements.map((supplement, index) => (
        <div key={index} className="border-b pb-3 last:border-0">
          <h4 className="font-medium">{supplement.name}</h4>
          <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
            <div>
              <span className="text-gray-500">Dosage:</span> {supplement.dosage}
            </div>
            <div>
              <span className="text-gray-500">Frequency:</span> {supplement.frequency}
            </div>
            <div>
              <span className="text-gray-500">Time:</span> {supplement.timeOfDay}
            </div>
          </div>
        </div>
      ))}
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
