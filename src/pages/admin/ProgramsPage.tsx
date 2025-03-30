
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ProgramsPage = () => {
  const { toast } = useToast();
  
  // Mock programs data
  const programs = [
    {
      id: '1',
      name: 'Weight Management',
      type: 'Nutrition',
      clients: 12,
      duration: '12 weeks',
      checkInFrequency: 'Weekly',
      clinic: 'Wellness Center'
    },
    {
      id: '2',
      name: 'Gut Health',
      type: 'Nutrition',
      clients: 8,
      duration: '8 weeks',
      checkInFrequency: 'Weekly',
      clinic: 'Practice Naturals'
    },
    {
      id: '3',
      name: 'Performance',
      type: 'Fitness',
      clients: 5,
      duration: '16 weeks',
      checkInFrequency: 'Bi-weekly',
      clinic: 'Health Partners'
    }
  ];

  const handleAddProgram = () => {
    toast({
      title: "Coming Soon",
      description: "The Add Program feature is under development",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        <Button onClick={handleAddProgram} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Add Program</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Check-in</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary-700" />
                        </div>
                        <div className="font-medium">{program.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{program.type}</TableCell>
                    <TableCell>{program.clinic}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{program.clients}</span>
                      </div>
                    </TableCell>
                    <TableCell>{program.duration}</TableCell>
                    <TableCell>{program.checkInFrequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramsPage;
