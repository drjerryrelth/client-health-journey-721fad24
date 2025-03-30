
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CoachList from '@/components/coaches/CoachList';

const CoachesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddCoach = () => {
    navigate('/add-coach');
    toast({
      title: "Coming Soon",
      description: "The Add Coach feature is under development",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coaches</h1>
        <Button onClick={handleAddCoach} className="flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Add Coach</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Coaches</CardTitle>
        </CardHeader>
        <CardContent>
          <CoachList />
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachesPage;
