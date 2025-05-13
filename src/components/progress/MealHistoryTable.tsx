
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subDays, format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Droplets, Pill } from 'lucide-react';

// Generate mock data for meals
const generateMockMeals = () => {
  const today = new Date();
  
  const meals = [
    {
      breakfast: ['Oatmeal with berries', 'Greek yogurt with honey', 'Avocado toast with eggs', 'Protein smoothie', 'Egg white omelet', 'Whole grain cereal', 'Breakfast burrito'],
      lunch: ['Grilled chicken salad', 'Turkey and avocado wrap', 'Quinoa bowl with vegetables', 'Tuna salad with crackers', 'Lentil soup with bread', 'Mediterranean salad', 'Veggie burger'],
      dinner: ['Baked salmon with sweet potato', 'Stir-fry with brown rice', 'Lean steak with roasted vegetables', 'Chicken curry with cauliflower rice', 'Pasta with turkey meatballs', 'Tofu and vegetable curry', 'Grilled fish tacos'],
      snacks: ['Apple with almond butter', 'Greek yogurt with berries', 'Protein bar', 'Handful of mixed nuts', 'Carrot sticks with hummus', 'String cheese', 'Hard boiled egg'],
      waterIntake: [6, 8, 7, 8, 6, 9, 7],
      supplements: [
        'Multivitamin, Omega-3, Vitamin D',
        'Multivitamin, Vitamin C, Magnesium',
        'Multivitamin, Probiotic, Calcium',
        'Multivitamin, Zinc, B-complex',
        'Multivitamin, Iron, Vitamin D',
        'Multivitamin, Probiotic, Magnesium',
        'Multivitamin, Omega-3, Vitamin C'
      ]
    }
  ];
  
  // Generate meal data for the last 7 days
  return Array(7).fill(null).map((_, index) => {
    const day = subDays(today, index); // Changed from (today, 6 - index) to show most recent first
    const randomIndex = Math.floor(Math.random() * meals[0].breakfast.length);
    
    return {
      date: format(day, 'EEEE, MMM d'),
      dateShort: format(day, 'MM/dd'),
      breakfast: meals[0].breakfast[randomIndex],
      lunch: meals[0].lunch[(randomIndex + 1) % meals[0].lunch.length],
      dinner: meals[0].dinner[(randomIndex + 2) % meals[0].dinner.length],
      snacks: meals[0].snacks[(randomIndex + 3) % meals[0].snacks.length],
      waterIntake: meals[0].waterIntake[index % meals[0].waterIntake.length],
      supplements: meals[0].supplements[index % meals[0].supplements.length],
    };
  });
};

const MealHistoryTable = () => {
  const mealData = React.useMemo(() => generateMockMeals(), []);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Meals</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
          <TabsTrigger value="snacks">Snacks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealData.map((day, index) => (
              <Card key={index} className={index === 0 ? 'border-primary border-2' : ''}>
                <div className={`py-2 px-4 ${index === 0 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  <h3 className="font-medium">{day.date}</h3>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Breakfast</h4>
                    <p>{day.breakfast}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Lunch</h4>
                    <p>{day.lunch}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Dinner</h4>
                    <p>{day.dinner}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Snacks</h4>
                    <p>{day.snacks}</p>
                  </div>
                  
                  {/* Water Intake Section */}
                  <div className="flex items-center gap-2">
                    <Droplets size={16} className="text-blue-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Water Intake</h4>
                      <p>{day.waterIntake} cups</p>
                    </div>
                  </div>
                  
                  {/* Supplements Section */}
                  <div className="flex items-center gap-2">
                    <Pill size={16} className="text-purple-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Supplements</h4>
                      <p>{day.supplements}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="breakfast" className="mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Breakfast</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealData.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.dateShort}</TableCell>
                    <TableCell>{day.breakfast}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="lunch" className="mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Lunch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealData.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.dateShort}</TableCell>
                    <TableCell>{day.lunch}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="dinner" className="mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Dinner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealData.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.dateShort}</TableCell>
                    <TableCell>{day.dinner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="snacks" className="mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Snacks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mealData.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{day.dateShort}</TableCell>
                    <TableCell>{day.snacks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MealHistoryTable;
