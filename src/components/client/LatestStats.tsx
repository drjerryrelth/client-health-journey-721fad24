
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, BarChart2, Scale, Droplets } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useClientData } from './ClientDataProvider';

const LatestStats: React.FC = () => {
  const { checkIns, waterProgress, weightTrend } = useClientData();

  return (
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
            
            {checkIns[0].waterIntake && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Water Intake</span>
                  </div>
                  <span className="text-sm">{checkIns[0].waterIntake} glasses</span>
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
  );
};

export default LatestStats;
