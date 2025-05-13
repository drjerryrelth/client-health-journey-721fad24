
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientDataContext } from '@/components/client/context/ClientDataContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays } from 'date-fns';

// Generate mock data for the past 7 days
const generateMockData = () => {
  const today = new Date();
  return Array(7).fill(null).map((_, index) => {
    const date = subDays(today, 6 - index);
    return {
      date: format(date, 'MM/dd'),
      fullDate: date.toISOString(),
      weight: Math.round(170 - Math.random() * 3 * index),
      waterIntake: Math.round(5 + Math.random() * 4),
      sleepHours: Math.round(6 + Math.random() * 3),
      moodScore: Math.round(6 + Math.random() * 4),
      energyScore: Math.round(5 + Math.random() * 5),
      exerciseDuration: Math.round(20 + Math.random() * 30)
    };
  });
};

const WeeklyProgressCharts = () => {
  const { checkIns } = React.useContext(ClientDataContext);
  
  // Use real data if available, otherwise use mock data
  const data = React.useMemo(() => {
    if (checkIns && checkIns.length >= 7) {
      return checkIns.slice(0, 7).map(checkIn => ({
        date: format(new Date(checkIn.date), 'MM/dd'),
        fullDate: checkIn.date,
        weight: checkIn.weight || null,
        waterIntake: checkIn.waterIntake || null,
        sleepHours: checkIn.sleepHours || null,
        moodScore: checkIn.moodScore || null,
        energyScore: checkIn.energyScore || null,
        exerciseDuration: 30 // Mock data for exercise
      }));
    }
    return generateMockData();
  }, [checkIns]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weight Tracking</CardTitle>
          <CardDescription>Your weight progress over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `${value} lbs`}
                />
                <Tooltip 
                  formatter={(value) => [`${value} lbs`, 'Weight']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#1eaedb"
                  strokeWidth={2}
                  name="Weight (lbs)"
                  dot={{ r: 4, fill: '#1eaedb', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sleep & Wellness</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sleep">
              <TabsList className="mb-4">
                <TabsTrigger value="sleep">Sleep</TabsTrigger>
                <TabsTrigger value="mood">Mood & Energy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sleep" className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${value} hrs`} />
                    <Tooltip formatter={(value) => [`${value} hours`, 'Sleep']} />
                    <Bar dataKey="sleepHours" name="Sleep Hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="mood" className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="moodScore" name="Mood (0-10)" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="energyScore" name="Energy (0-10)" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Water & Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="water">
              <TabsList className="mb-4">
                <TabsTrigger value="water">Water</TabsTrigger>
                <TabsTrigger value="exercise">Exercise</TabsTrigger>
              </TabsList>
              
              <TabsContent value="water" className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${value} cups`} />
                    <Tooltip formatter={(value) => [`${value} cups`, 'Water Intake']} />
                    <Bar dataKey="waterIntake" name="Water Intake" fill="#00C9FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="exercise" className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${value} min`} />
                    <Tooltip formatter={(value) => [`${value} minutes`, 'Exercise']} />
                    <Bar dataKey="exerciseDuration" name="Exercise (minutes)" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyProgressCharts;
