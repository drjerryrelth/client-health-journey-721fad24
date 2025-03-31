import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Program } from '@/types';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProgramGuidelinesProps {
  programType: string;
  category?: string | null;
}

const ProgramGuidelines: React.FC<ProgramGuidelinesProps> = ({ programType, category }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Guidelines</CardTitle>
      </CardHeader>
      <CardContent>
        {programType === 'practice_naturals' && (
          <PracticeNaturalsGuidelines category={category} />
        )}
        
        {programType === 'chirothin' && (
          <ChiroThinGuidelines />
        )}
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="font-medium mb-2">General Guidelines</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Drink 80-100 oz of water daily</span>
            </li>
            <li className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Coffee and tea are allowed (watch creamer)</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>No dairy or alcohol allowed</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Focus on high protein, low carb, low fat</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Choose lean proteins (bacon does not apply)</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Avoid cooking oils - use dry rubs and seasonings instead</span>
            </li>
            <li className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>For salads, avoid dairy-based dressings and use only 1 tbsp of olive or avocado oil</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const PracticeNaturalsGuidelines: React.FC<{ category?: string | null }> = ({ category }) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Practice Naturals™ - Category {category || '?'}</h3>
      
      {category === 'A' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">Breakfast</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein, OR</li>
              <li>20g protein in a vegan protein shake</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Lunch</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>2 oz fruit</li>
              <li>4 oz vegetables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Dinner</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>2 oz fruit</li>
              <li>4 oz vegetables</li>
            </ul>
          </div>
        </div>
      )}
      
      {category === 'B' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">Breakfast</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>5 oz protein, OR</li>
              <li>20g protein in a vegan protein shake</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Lunch</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>3 oz fruit</li>
              <li>6 oz vegetables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Dinner</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>3 oz fruit</li>
              <li>4 oz vegetables</li>
            </ul>
          </div>
        </div>
      )}
      
      {category === 'C' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm">Breakfast</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>5 oz protein, OR</li>
              <li>20g protein in a vegan protein shake</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Lunch</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>4 oz fruit</li>
              <li>6 oz vegetables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm">Dinner</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>4 oz protein</li>
              <li>4 oz fruit</li>
              <li>6 oz vegetables</li>
            </ul>
          </div>
        </div>
      )}
      
      {!category && (
        <div className="bg-yellow-50 p-3 rounded-md text-sm">
          <p className="text-yellow-800">No category assigned. Please contact your coach.</p>
        </div>
      )}

      <div className="mt-4">
        <h4 className="font-medium">Recommended Supplements</h4>
        <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
          <li>Boost: 1 dropper under the tongue 3x/day</li>
          <li>Burn (optional): 1 capsule with breakfast, before 10am</li>
          <li>Cleanse: 1 capsule with both lunch and dinner</li>
          <li>Digest: 1 capsule with both lunch and dinner</li>
          <li>Suppress: 1 capsule 1-2 hrs AFTER lunch and dinner</li>
          <li>Reuv or Revive (optional): Collagen - take anytime 1x/day</li>
          <li>V-Pro (optional): Vegan protein shake anytime</li>
          <li>Sweep (optional): Take as directed by Coach</li>
        </ul>
      </div>
    </div>
  );
};

const ChiroThinGuidelines: React.FC = () => {
  return (
    <div>
      <h3 className="font-medium mb-3">ChiroThin™ Program</h3>
      
      <div className="space-y-4">
        <div>
          <ul className="list-disc pl-5 text-sm">
            <li className="text-red-600 font-medium">No Breakfast or snacks allowed</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-sm">Lunch & Dinner</h4>
          <ul className="list-disc pl-5 text-sm">
            <li>4 oz protein</li>
            <li>4 oz fruit</li>
            <li>4 oz vegetables</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Recommended Supplements</h4>
        <ul className="list-disc pl-5 text-sm mt-1">
          <li>ChiroThin™ drops: Take 10 drops under the tongue 3x/day</li>
        </ul>
      </div>
    </div>
  );
};

export default ProgramGuidelines;
