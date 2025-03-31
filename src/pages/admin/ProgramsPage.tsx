
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Utensils, Calendar, ListCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useProgramsQuery, useCreateProgramMutation } from '@/hooks/use-queries';
import { Program } from '@/types';
import { Loader2 } from 'lucide-react';
import ProgramDetailsDialog from '@/components/programs/ProgramDetailsDialog';

const ProgramsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: programs, isLoading, isError } = useProgramsQuery(user?.clinicId);
  const createProgramMutation = useCreateProgramMutation();
  
  const [showAddProgramDialog, setShowAddProgramDialog] = useState(false);
  const [programName, setProgramName] = useState('');
  const [programType, setProgramType] = useState('');
  const [programDuration, setProgramDuration] = useState('');
  const [checkInFrequency, setCheckInFrequency] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramDetails, setShowProgramDetails] = useState(false);

  const handleAddProgram = () => {
    setShowAddProgramDialog(true);
  };

  const handleSubmitProgram = async () => {
    if (!programName || !programType || !programDuration || !checkInFrequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert duration string to number of days
      let durationInDays = 0;
      if (programDuration === '4-weeks') durationInDays = 28;
      if (programDuration === '6-weeks') durationInDays = 42;
      if (programDuration === '8-weeks') durationInDays = 56;
      if (programDuration === '12-weeks') durationInDays = 84;
      if (programDuration === '16-weeks') durationInDays = 112;
      if (programDuration === '24-weeks') durationInDays = 168;
      if (programDuration === '30-days') durationInDays = 30;
      if (programDuration === '60-days') durationInDays = 60;
      
      await createProgramMutation.mutateAsync({
        program: {
          name: programName,
          description: programDescription || `${programName} program`,
          type: programType,
          duration: durationInDays,
          checkInFrequency: checkInFrequency,
          clinicId: user?.clinicId || ''
        },
        supplements: [] // No supplements for now, will add later
      });

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
    } catch (error) {
      console.error("Error creating program:", error);
      toast({
        title: "Error",
        description: "Failed to create program. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProgramDetails = (program: Program) => {
    setSelectedProgram(program);
    setShowProgramDetails(true);
  };

  const getProgramIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'nutrition':
      case 'practice_naturals':
        return <Utensils className="h-5 w-5 text-primary-700" />;
      case 'fitness':
        return <ListCheck className="h-5 w-5 text-primary-700" />;
      case 'chirothin':
      case 'keto':
        return <Calendar className="h-5 w-5 text-primary-700" />;
      default:
        return <FileText className="h-5 w-5 text-primary-700" />;
    }
  };

  const formatDuration = (days: number): string => {
    if (days === 30) return '30 days';
    if (days === 60) return '60 days';
    if (days % 7 === 0) {
      const weeks = days / 7;
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    }
    return `${days} days`;
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load programs. Please try again.
            </div>
          ) : programs && programs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Check-in</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow 
                      key={program.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewProgramDetails(program)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
                            {getProgramIcon(program.type)}
                          </div>
                          <div className="font-medium">{program.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {program.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDuration(program.duration)}</TableCell>
                      <TableCell>{program.checkInFrequency === 'daily' ? 'Daily' : 'Weekly'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No programs found. Click "Add Program" to create one.
            </div>
          )}
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
                  <SelectItem value="practice_naturals">Practice Naturals</SelectItem>
                  <SelectItem value="chirothin">ChiroThin</SelectItem>
                  <SelectItem value="nutrition">General Nutrition</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
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
                  <SelectItem value="30-days">30 Days</SelectItem>
                  <SelectItem value="60-days">60 Days</SelectItem>
                  <SelectItem value="6-weeks">6 Weeks</SelectItem>
                  <SelectItem value="8-weeks">8 Weeks</SelectItem>
                  <SelectItem value="12-weeks">12 Weeks</SelectItem>
                  <SelectItem value="16-weeks">16 Weeks</SelectItem>
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
            <Button variant="outline" onClick={() => setShowAddProgramDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitProgram} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Program"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Program Details Dialog */}
      <ProgramDetailsDialog 
        program={selectedProgram}
        isOpen={showProgramDetails}
        onClose={() => setShowProgramDetails(false)}
      />
    </div>
  );
};

export default ProgramsPage;
