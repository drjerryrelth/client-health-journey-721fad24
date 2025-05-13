
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets } from 'lucide-react';

interface MealHistoryTableProps {
  data: any[];
}

const MealHistoryTable: React.FC<MealHistoryTableProps> = ({ data = [] }) => {
  // Set a default empty array if data is undefined
  const safeData = data || [];
  
  // Only use recent check-ins with meal data
  const filteredData = safeData
    .filter(item => item.meals?.breakfast || item.meals?.lunch || item.meals?.dinner || item.meals?.snacks || item.waterIntake)
    .slice(0, 7);

  return (
    <div className="space-y-4">
      {filteredData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No meal data recorded yet
        </div>
      ) : (
        filteredData.map((checkIn) => (
          <Card key={checkIn.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  {new Date(checkIn.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </CardTitle>
                {checkIn.waterIntake > 0 && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm font-medium">{checkIn.waterIntake} oz</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-3">
                {checkIn.meals?.breakfast && (
                  <div className="border-b pb-2">
                    <h4 className="text-sm font-medium mb-1">Breakfast</h4>
                    <div className="flex flex-col gap-1">
                      {checkIn.breakfastProtein && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Protein:</span> {checkIn.breakfastProtein} 
                          {checkIn.breakfastProteinPortion && <span className="text-gray-500"> ({checkIn.breakfastProteinPortion} oz)</span>}
                        </p>
                      )}
                      {checkIn.breakfastFruit && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Fruit:</span> {checkIn.breakfastFruit}
                          {checkIn.breakfastFruitPortion && <span className="text-gray-500"> ({checkIn.breakfastFruitPortion} oz)</span>}
                        </p>
                      )}
                      {checkIn.breakfastVegetable && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Vegetable:</span> {checkIn.breakfastVegetable}
                          {checkIn.breakfastVegetablePortion && <span className="text-gray-500"> ({checkIn.breakfastVegetablePortion} oz)</span>}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {checkIn.meals?.lunch && (
                  <div className="border-b pb-2">
                    <h4 className="text-sm font-medium mb-1">Lunch</h4>
                    <div className="flex flex-col gap-1">
                      {checkIn.lunchProtein && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Protein:</span> {checkIn.lunchProtein}
                          {checkIn.lunchProteinPortion && <span className="text-gray-500"> ({checkIn.lunchProteinPortion} oz)</span>}
                        </p>
                      )}
                      {checkIn.lunchFruit && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Fruit:</span> {checkIn.lunchFruit}
                          {checkIn.lunchFruitPortion && <span className="text-gray-500"> ({checkIn.lunchFruitPortion} oz)</span>}
                        </p>
                      )}
                      {checkIn.lunchVegetable && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Vegetable:</span> {checkIn.lunchVegetable}
                          {checkIn.lunchVegetablePortion && <span className="text-gray-500"> ({checkIn.lunchVegetablePortion} oz)</span>}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {checkIn.meals?.dinner && (
                  <div className="border-b pb-2">
                    <h4 className="text-sm font-medium mb-1">Dinner</h4>
                    <div className="flex flex-col gap-1">
                      {checkIn.dinnerProtein && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Protein:</span> {checkIn.dinnerProtein}
                          {checkIn.dinnerProteinPortion && <span className="text-gray-500"> ({checkIn.dinnerProteinPortion} oz)</span>}
                        </p>
                      )}
                      {checkIn.dinnerFruit && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Fruit:</span> {checkIn.dinnerFruit}
                          {checkIn.dinnerFruitPortion && <span className="text-gray-500"> ({checkIn.dinnerFruitPortion} oz)</span>}
                        </p>
                      )}
                      {checkIn.dinnerVegetable && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Vegetable:</span> {checkIn.dinnerVegetable}
                          {checkIn.dinnerVegetablePortion && <span className="text-gray-500"> ({checkIn.dinnerVegetablePortion} oz)</span>}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {checkIn.meals?.snacks && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Snacks</h4>
                    <p className="text-sm text-gray-600">{checkIn.meals.snacks}
                      {checkIn.snackPortion && <span className="text-gray-500"> ({checkIn.snackPortion} oz)</span>}
                    </p>
                  </div>
                )}

                {checkIn.supplements && checkIn.supplements.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <h4 className="text-sm font-medium mb-2">Supplements</h4>
                    <div className="flex flex-wrap gap-2">
                      {checkIn.supplements.map((supplement: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {supplement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MealHistoryTable;
