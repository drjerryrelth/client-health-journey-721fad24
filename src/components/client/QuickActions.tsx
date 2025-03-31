
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Scale, BarChart2 } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
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
  );
};

export default QuickActions;
