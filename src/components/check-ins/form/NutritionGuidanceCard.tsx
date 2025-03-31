import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { AlertCircle } from 'lucide-react';

interface NutritionGuidanceCardProps {
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

const NutritionGuidanceCard: React.FC<NutritionGuidanceCardProps> = ({ mealType }) => {
  const { user } = useAuth();
  const [programType, setProgramType] = useState<string | null>(null);
  const [programCategory, setProgramCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramInfo = async () => {
      if (!user?.id) return;
      
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('program_id, program_category')
          .eq('user_id', user.id)
          .single();
          
        if (clientError) throw clientError;
        
        if (clientData?.program_id) {
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('type')
            .eq('id', clientData.program_id)
            .single();
            
          if (programError) throw programError;
          
          if (programData) {
            setProgramType(programData.type);
            setProgramCategory(clientData.program_category);
          }
        }
      } catch (error) {
        console.error("Error fetching program info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgramInfo();
  }, [user?.id]);
  
  const renderFoodPrepReminder = () => {
    if (programType === 'practice_naturals' || programType === 'chirothin') {
      return (
        <Card className="mb-4 border-amber-300 bg-amber-50">
          <CardHeader className="py-3 pb-1">
            <CardTitle className="text-sm text-amber-800">Food Prep Reminder</CardTitle>
          </CardHeader>
          <CardContent className="py-2 text-sm text-amber-700">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Avoid cooking oils</strong> - use dry rubs and seasonings instead</li>
              <li>For salads, use only 1 tbsp of olive or avocado oil</li>
              <li>No dairy-based dressings allowed</li>
            </ul>
          </CardContent>
        </Card>
      );
    }
    return null;
  };
  
  if (loading || !programType) {
    return null;
  }
  
  if (programType === 'chirothin' && mealType === 'breakfast') {
    return (
      <Card className="mb-4 border-red-300 bg-red-50">
        <CardContent className="py-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">
                No breakfast allowed on the ChiroThin program
              </p>
              <p className="text-sm text-red-600">
                Your program does not include breakfast. Please leave this empty.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (programType === 'chirothin' && (mealType === 'lunch' || mealType === 'dinner')) {
    return (
      <>
        {renderFoodPrepReminder()}
        <Card className="mb-4 border-blue-300 bg-blue-50">
          <CardHeader className="py-3 pb-1">
            <CardTitle className="text-sm text-blue-800">ChiroThin Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="py-2 text-sm text-blue-700">
            <ul className="list-disc pl-5 space-y-1">
              <li>4 oz protein</li>
              <li>4 oz fruit</li>
              <li>4 oz vegetables</li>
            </ul>
          </CardContent>
        </Card>
      </>
    );
  }
  
  if (programType === 'practice_naturals') {
    if (!programCategory) {
      return (
        <Card className="mb-4 border-yellow-300 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <p className="text-sm text-yellow-800">
                No program category assigned. Please contact your coach for meal portion guidelines.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    if (programCategory === 'A') {
      if (mealType === 'breakfast') {
        return (
          <>
            {renderFoodPrepReminder()}
            <Card className="mb-4 border-blue-300 bg-blue-50">
              <CardHeader className="py-3 pb-1">
                <CardTitle className="text-sm text-blue-800">Category A - Breakfast</CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>4 oz protein, OR</li>
                  <li>20g protein in a vegan protein shake</li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
      
      if (mealType === 'lunch' || mealType === 'dinner') {
        return (
          <>
            {renderFoodPrepReminder()}
            <Card className="mb-4 border-blue-300 bg-blue-50">
              <CardHeader className="py-3 pb-1">
                <CardTitle className="text-sm text-blue-800">
                  Category A - {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>4 oz protein</li>
                  <li>2 oz fruit</li>
                  <li>4 oz vegetables</li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
    }
    
    if (programCategory === 'B') {
      if (mealType === 'breakfast') {
        return (
          <>
            {renderFoodPrepReminder()}
            <Card className="mb-4 border-blue-300 bg-blue-50">
              <CardHeader className="py-3 pb-1">
                <CardTitle className="text-sm text-blue-800">Category B - Breakfast</CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>5 oz protein, OR</li>
                  <li>20g protein in a vegan protein shake</li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
      
      if (mealType === 'lunch') {
        return (
          <>
            {renderFoodPrepReminder()}
            <Card className="mb-4 border-blue-300 bg-blue-50">
              <CardHeader className="py-3 pb-1">
                <CardTitle className="text-sm text-blue-800">Category B - Lunch</CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>4 oz protein</li>
                  <li>3 oz fruit</li>
                  <li>6 oz vegetables</li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
      
      if (mealType === 'dinner') {
        return (
          <>
            {renderFoodPrepReminder()}
            <Card className="mb-4 border-blue-300 bg-blue-50">
              <CardHeader className="py-3 pb-1">
                <CardTitle className="text-sm text-blue-800">Category B - Dinner</CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>4 oz protein</li>
                  <li>3 oz fruit</li>
                  <li>4 oz vegetables</li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
    }
    
    if (programCategory === 'C') {
      if (mealType === 'breakfast') {
        return (
          <>
            {renderFoodPrepReminder()}
            <Card className="mb-4 border-blue-300 bg-blue-50">
              <CardHeader className="py-3 pb-1">
                <CardTitle className="text-sm text-blue-800">Category C - Breakfast</CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>5 oz protein, OR</li>
                  <li>20g protein in a vegan protein shake</li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
      
      if (mealType === 'lunch' || mealType === 'dinner') {
        return (
          <>
            {renderFoodPrepReminder()}
            <Card className="mb-4 border-blue-300 bg-blue-50">
              <CardHeader className="py-3 pb-1">
                <CardTitle className="text-sm text-blue-800">
                  Category C - {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>4 oz protein</li>
                  <li>4 oz fruit</li>
                  <li>6 oz vegetables</li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
    }
  }
  
  return null;
};

export default NutritionGuidanceCard;
