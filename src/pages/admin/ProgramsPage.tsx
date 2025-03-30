
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const ProgramsPage = () => {
  const { toast } = useToast();
  const [showAddProgramDialog, setShowAddProgramDialog] = useState(false);
  const [programName, setProgramName] = useState('');
  const [programType, setProgramType] = useState('');
  const [programDuration, setProgramDuration] = useState('');
  const [checkInFrequency, setCheckInFrequency] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  
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
    setShowAddProgramDialog(true);
  };

  const handleSubmitProgram = () => {
    if (!programName || !programType || !programDuration || !checkInFrequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Program Created",
      description: `${programName} program has been created successfully.`
    });

    // Reset form and close dialog
    setProgramName('');
    setProgramType('');
    setProgramDuration('');
    setCheckInFrequency('');
    setProgramDescription('');
    setShowAddProgramDialog(false);
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

      {/* Add Program Dialog */}
      <Dialog open={showAddProgramDialog} onOpenChange={setShowAddProgramDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
            <DialogDescription>
              Create a new program for your clinics. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program-name" className="text-right">
                Name
              </Label>
              <Input
                id="program-name"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program-type" className="text-right">
                Type
              </Label>
              <Select value={programType} onValueChange={setProgramType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="weight-management">Weight Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program-duration" className="text-right">
                Duration
              </Label>
              <Select value={programDuration} onValueChange={setProgramDuration}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4-weeks">4 Weeks</SelectItem>
                  <SelectItem value="8-weeks">8 Weeks</SelectItem>
                  <SelectItem value="12-weeks">12 Weeks</SelectItem>
                  <SelectItem value="16-weeks">16 Weeks</SelectItem>
                  <SelectItem value="24-weeks">24 Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="check-in-frequency" className="text-right">
                Check-in
              </Label>
              <Select value={checkInFrequency} onValueChange={setCheckInFrequency}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select check-in frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program-description" className="text-right align-top pt-2">
                Description
              </Label>
              <Textarea
                id="program-description"
                value={programDescription}
                onChange={(e) => setProgramDescription(e.target.value)}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProgramDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitProgram}>
              Create Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramsPage;
