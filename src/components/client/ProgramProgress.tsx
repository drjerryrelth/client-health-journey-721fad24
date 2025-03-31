
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClientData } from './ClientDataProvider';

const ProgramProgress: React.FC = () => {
  const { programName, clientStartDate, calculateProgress } = useClientData();
  const progressPercent = calculateProgress();

  return (
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
  );
};

export default ProgramProgress;
