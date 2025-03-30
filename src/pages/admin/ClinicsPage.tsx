
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Building, ChevronRight, ArrowLeft, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CoachList from '@/components/coaches/CoachList';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ClinicsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedClinic, setSelectedClinic] = useState<{id: string, name: string} | null>(null);
  const [showAddCoachDialog, setShowAddCoachDialog] = useState(false);
  const [showEditCoachDialog, setShowEditCoachDialog] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  
  // Form state
  const [coachName, setCoachName] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPhone, setCoachPhone] = useState('');

  // Mock clinics data
  const clinics = [
    { 
      id: '1',
      name: 'Wellness Center',
      coaches: 4,
      clients: 18,
      location: 'New York, NY',
      status: 'active'
    },
    { 
      id: '2',
      name: 'Practice Naturals',
      coaches: 3,
      clients: 12,
      location: 'Los Angeles, CA',
      status: 'active'
    },
    { 
      id: '3',
      name: 'Health Partners',
      coaches: 2,
      clients: 9,
      location: 'Chicago, IL',
      status: 'active'
    },
  ];

  const handleAddClinic = () => {
    toast({
      title: "Coming Soon",
      description: "The Add Clinic feature is under development",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClinicSelect = (clinic: {id: string, name: string}) => {
    setSelectedClinic(clinic);
  };

  const handleBackToAllClinics = () => {
    setSelectedClinic(null);
  };

  const handleAddCoach = () => {
    setShowAddCoachDialog(true);
  };

  const handleEditCoach = (coach: any) => {
    setSelectedCoach(coach);
    setCoachName(coach.name);
    setCoachEmail(coach.email);
    setCoachPhone(coach.phone || '');
    setShowEditCoachDialog(true);
  };

  const handleDeleteCoach = (coach: any) => {
    toast({
      title: "Confirm Deletion",
      description: `Are you sure you want to remove ${coach.name}? This will revoke their access to the system.`,
      action: (
        <Button 
          variant="destructive" 
          onClick={() => {
            // Here you would delete the coach
            toast({
              title: "Coach Removed",
              description: `${coach.name} has been removed from ${selectedClinic?.name}.`
            });
          }}
        >
          Delete
        </Button>
      ),
    });
  };

  const handleSubmitAddCoach = () => {
    if (!coachName || !coachEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide name and email for the coach.",
        variant: "destructive"
      });
      return;
    }

    // Here you would add the coach to the database
    toast({
      title: "Coach Added",
      description: `${coachName} has been added to ${selectedClinic?.name}.`
    });
    
    setShowAddCoachDialog(false);
    setCoachName('');
    setCoachEmail('');
    setCoachPhone('');
  };

  const handleSubmitEditCoach = () => {
    if (!coachName || !coachEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide name and email for the coach.",
        variant: "destructive"
      });
      return;
    }

    // Here you would update the coach in the database
    toast({
      title: "Coach Updated",
      description: `${coachName}'s information has been updated.`
    });
    
    setShowEditCoachDialog(false);
    setSelectedCoach(null);
    setCoachName('');
    setCoachEmail('');
    setCoachPhone('');
  };

  if (selectedClinic) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToAllClinics}
            className="mr-2 flex items-center gap-1"
          >
            <ArrowLeft size={18} />
            <span>Back to All Clinics</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedClinic.name} - Coaches</h1>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Coaches at {selectedClinic.name}</CardTitle>
            <Button onClick={handleAddCoach} className="flex items-center gap-2">
              <UserPlus size={18} />
              <span>Add Coach</span>
            </Button>
          </CardHeader>
          <CardContent>
            <CoachList 
              clinicId={selectedClinic.id} 
              onEdit={handleEditCoach}
              onDelete={handleDeleteCoach}
            />
          </CardContent>
        </Card>

        {/* Add Coach Dialog */}
        <Dialog open={showAddCoachDialog} onOpenChange={setShowAddCoachDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Coach</DialogTitle>
              <DialogDescription>
                Add a new coach to {selectedClinic.name}. They will receive an email invitation to set up their account.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input 
                  id="name" 
                  value={coachName} 
                  onChange={(e) => setCoachName(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={coachEmail} 
                  onChange={(e) => setCoachEmail(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={coachPhone} 
                  onChange={(e) => setCoachPhone(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddCoachDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmitAddCoach}>
                Add Coach
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Coach Dialog */}
        <Dialog open={showEditCoachDialog} onOpenChange={setShowEditCoachDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Coach</DialogTitle>
              <DialogDescription>
                Update coach information for {selectedClinic.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input 
                  id="edit-name" 
                  value={coachName} 
                  onChange={(e) => setCoachName(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={coachEmail} 
                  onChange={(e) => setCoachEmail(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <Input 
                  id="edit-phone" 
                  type="tel" 
                  value={coachPhone} 
                  onChange={(e) => setCoachPhone(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditCoachDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmitEditCoach}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clinics</h1>
        <Button onClick={handleAddClinic} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Add Clinic</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Clinics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Coaches</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.map((clinic) => (
                  <TableRow key={clinic.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary-700" />
                        </div>
                        <div className="font-medium">{clinic.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{clinic.coaches}</TableCell>
                    <TableCell>{clinic.clients}</TableCell>
                    <TableCell>{clinic.location}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(clinic.status)} variant="outline">
                        {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        className="flex items-center"
                        onClick={() => handleClinicSelect({id: clinic.id, name: clinic.name})}
                      >
                        <span className="mr-1">Manage Coaches</span>
                        <ChevronRight size={16} />
                      </Button>
                    </TableCell>
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

export default ClinicsPage;
