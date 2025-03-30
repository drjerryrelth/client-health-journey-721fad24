
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, Activity, Weight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import ProgressChart from '@/components/progress/ProgressChart';

const ClientDashboard = () => {
  const { user } = useAuth();
  
  // Mock data
  const currentWeight = 172;
  const startWeight = 185;
  const goalWeight = 160;
  const weightProgress = Math.floor(((startWeight - currentWeight) / (startWeight - goalWeight)) * 100);
  
  // Mock check-in streak
  const streak = 5;
  
  const daysLeft = 21;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>
      
      {/* Program Progress Overview */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Current Program: <span className="text-primary-600">Practice Naturals</span></span>
            <span className="text-sm text-gray-500">{daysLeft} days left</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium">Program Progress</span>
              <span>55%</span>
            </div>
            <Progress value={55} className="h-2" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-primary-600">{startWeight} lbs</div>
              <div className="text-xs text-gray-500">Starting Weight</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-primary-600">{currentWeight} lbs</div>
              <div className="text-xs text-gray-500">Current Weight</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-primary-600">{goalWeight} lbs</div>
              <div className="text-xs text-gray-500">Goal Weight</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Weight Loss</CardTitle>
            <Weight className="text-primary-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-{startWeight - currentWeight} lbs</div>
            <Progress value={weightProgress} className="h-1 mt-2" />
            <p className="text-xs text-gray-500 mt-2">{weightProgress}% to goal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Energy</CardTitle>
            <Activity className="text-secondary-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.5/10</div>
            <Progress value={75} className="h-1 mt-2" />
            <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Check-in Streak</CardTitle>
            <Calendar className="text-orange-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <div className="flex mt-2">
              {Array(7).fill(0).map((_, i) => (
                <div 
                  key={i}
                  className={`h-1 flex-1 mx-0.5 rounded-full ${i < streak ? 'bg-orange-500' : 'bg-gray-200'}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Keep it up!</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart and Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Weight Progress</CardTitle>
              <Link to="/progress">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ProgressChart />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Daily Check-in</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Don't forget to log your daily progress!</p>
                <Link to="/check-in">
                  <Button className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Check-in
                  </Button>
                </Link>
              </div>
              
              <div className="w-full pt-4 border-t border-gray-200">
                <h4 className="font-medium text-sm mb-2">Today's Supplements</h4>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between text-sm">
                    <span>Metabolic Booster</span>
                    <span className="text-xs bg-primary-100 text-primary-800 py-1 px-2 rounded">Morning</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span>Omega Complex</span>
                    <span className="text-xs bg-secondary-100 text-secondary-800 py-1 px-2 rounded">Evening</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
