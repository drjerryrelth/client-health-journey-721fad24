
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Coffee, Apple, UtensilsCrossed, Pizza } from 'lucide-react';

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
                    <span className="text-sm font-medium">{checkIn.waterIntake} glasses</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <div className="space-y-3">
                {checkIn.meals?.breakfast && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Coffee className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Breakfast</h4>
                      <p className="text-sm text-gray-600">{checkIn.meals.breakfast}</p>
                    </div>
                  </div>
                )}
                
                {checkIn.meals?.lunch && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Apple className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Lunch</h4>
                      <p className="text-sm text-gray-600">{checkIn.meals.lunch}</p>
                    </div>
                  </div>
                )}
                
                {checkIn.meals?.dinner && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <UtensilsCrossed className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Dinner</h4>
                      <p className="text-sm text-gray-600">{checkIn.meals.dinner}</p>
                    </div>
                  </div>
                )}
                
                {checkIn.meals?.snacks && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Pizza className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Snacks</h4>
                      <p className="text-sm text-gray-600">{checkIn.meals.snacks}</p>
                    </div>
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
