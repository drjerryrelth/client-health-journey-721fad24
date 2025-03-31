
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

// Import refactored components
import MeasurementsTab from './form/MeasurementsTab';
import WellnessTab from './form/WellnessTab';
import NutritionTab from './form/NutritionTab';
import SupplementsTab from './form/SupplementsTab';
import CheckInFormTabs from './form/CheckInFormTabs';
import CheckInNavigation from './form/CheckInNavigation';

const CheckInForm = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("measurements");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Form state
  const [weight, setWeight] = useState("");
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [moodLevel, setMoodLevel] = useState([5]);
  const [waterIntake, setWaterIntake] = useState("64");
  const [exercise, setExercise] = useState("");
  const [exerciseTime, setExerciseTime] = useState("");
  const [exerciseType, setExerciseType] = useState("steps");
  const [sleepHours, setSleepHours] = useState("");
  
  // Nutrition state with portions for each item
  const [breakfastProtein, setBreakfastProtein] = useState("");
  const [breakfastProteinPortion, setBreakfastProteinPortion] = useState("");
  const [breakfastFruit, setBreakfastFruit] = useState("");
  const [breakfastFruitPortion, setBreakfastFruitPortion] = useState("");
  const [breakfastVegetable, setBreakfastVegetable] = useState("");
  const [breakfastVegetablePortion, setBreakfastVegetablePortion] = useState("");
  
  const [lunchProtein, setLunchProtein] = useState("");
  const [lunchProteinPortion, setLunchProteinPortion] = useState("");
  const [lunchFruit, setLunchFruit] = useState("");
  const [lunchFruitPortion, setLunchFruitPortion] = useState("");
  const [lunchVegetable, setLunchVegetable] = useState("");
  const [lunchVegetablePortion, setLunchVegetablePortion] = useState("");
  
  const [dinnerProtein, setDinnerProtein] = useState("");
  const [dinnerProteinPortion, setDinnerProteinPortion] = useState("");
  const [dinnerFruit, setDinnerFruit] = useState("");
  const [dinnerFruitPortion, setDinnerFruitPortion] = useState("");
  const [dinnerVegetable, setDinnerVegetable] = useState("");
  const [dinnerVegetablePortion, setDinnerVegetablePortion] = useState("");
  
  const [snacks, setSnacks] = useState("");
  const [snackPortion, setSnackPortion] = useState("");
  
  // Supplements state
  const [supplements, setSupplements] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // In a real app, this would send data to the server with the selected date
    setTimeout(() => {
      toast({
        title: "Check-in submitted",
        description: `Your check-in for ${format(selectedDate, 'MMMM d, yyyy')} has been recorded successfully.`,
      });
      setIsSubmitting(false);
      
      // Reset form or redirect
    }, 1500);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Daily Check-in</CardTitle>
          <div className="mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, 'MMMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  // Limit date selection to past 7 days and today
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    sevenDaysAgo.setHours(0, 0, 0, 0);
                    
                    return date > today || date < sevenDaysAgo;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} className="w-full">
            <CheckInFormTabs 
              currentTab={currentTab} 
              onTabChange={setCurrentTab} 
            />
            
            <div>
              <TabsContent value="measurements" className="space-y-6">
                <MeasurementsTab 
                  weight={weight}
                  setWeight={setWeight}
                  waterIntake={waterIntake}
                  setWaterIntake={setWaterIntake}
                  exerciseType={exerciseType}
                  setExerciseType={setExerciseType}
                  exercise={exercise}
                  setExercise={setExercise}
                  exerciseTime={exerciseTime}
                  setExerciseTime={setExerciseTime}
                />
              </TabsContent>
              
              <TabsContent value="wellness" className="space-y-6">
                <WellnessTab 
                  energyLevel={energyLevel}
                  setEnergyLevel={setEnergyLevel}
                  moodLevel={moodLevel}
                  setMoodLevel={setMoodLevel}
                  sleepHours={sleepHours}
                  setSleepHours={setSleepHours}
                />
              </TabsContent>
              
              <TabsContent value="nutrition" className="space-y-6">
                <NutritionTab 
                  breakfastProtein={breakfastProtein}
                  setBreakfastProtein={setBreakfastProtein}
                  breakfastProteinPortion={breakfastProteinPortion}
                  setBreakfastProteinPortion={setBreakfastProteinPortion}
                  breakfastFruit={breakfastFruit}
                  setBreakfastFruit={setBreakfastFruit}
                  breakfastFruitPortion={breakfastFruitPortion}
                  setBreakfastFruitPortion={setBreakfastFruitPortion}
                  breakfastVegetable={breakfastVegetable}
                  setBreakfastVegetable={setBreakfastVegetable}
                  breakfastVegetablePortion={breakfastVegetablePortion}
                  setBreakfastVegetablePortion={setBreakfastVegetablePortion}
                  
                  lunchProtein={lunchProtein}
                  setLunchProtein={setLunchProtein}
                  lunchProteinPortion={lunchProteinPortion}
                  setLunchProteinPortion={setLunchProteinPortion}
                  lunchFruit={lunchFruit}
                  setLunchFruit={setLunchFruit}
                  lunchFruitPortion={lunchFruitPortion}
                  setLunchFruitPortion={setLunchFruitPortion}
                  lunchVegetable={lunchVegetable}
                  setLunchVegetable={setLunchVegetable}
                  lunchVegetablePortion={lunchVegetablePortion}
                  setLunchVegetablePortion={setLunchVegetablePortion}
                  
                  dinnerProtein={dinnerProtein}
                  setDinnerProtein={setDinnerProtein}
                  dinnerProteinPortion={dinnerProteinPortion}
                  setDinnerProteinPortion={setDinnerProteinPortion}
                  dinnerFruit={dinnerFruit}
                  setDinnerFruit={setDinnerFruit}
                  dinnerFruitPortion={dinnerFruitPortion}
                  setDinnerFruitPortion={setDinnerFruitPortion}
                  dinnerVegetable={dinnerVegetable}
                  setDinnerVegetable={setDinnerVegetable}
                  dinnerVegetablePortion={dinnerVegetablePortion}
                  setDinnerVegetablePortion={setDinnerVegetablePortion}
                  
                  snacks={snacks}
                  setSnacks={setSnacks}
                  snackPortion={snackPortion}
                  setSnackPortion={setSnackPortion}
                />
              </TabsContent>
              
              <TabsContent value="supplements" className="space-y-6">
                <SupplementsTab 
                  supplements={supplements}
                  setSupplements={setSupplements}
                  notes={notes}
                  setNotes={setNotes}
                />
              </TabsContent>
              
              <CheckInNavigation 
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInForm;
