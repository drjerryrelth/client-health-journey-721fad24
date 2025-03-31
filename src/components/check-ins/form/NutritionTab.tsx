
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MealSection from './MealSection';

interface NutritionTabProps {
  breakfastProtein: string;
  setBreakfastProtein: (value: string) => void;
  breakfastProteinPortion: string;
  setBreakfastProteinPortion: (value: string) => void;
  breakfastFruit: string;
  setBreakfastFruit: (value: string) => void;
  breakfastFruitPortion: string;
  setBreakfastFruitPortion: (value: string) => void;
  breakfastVegetable: string;
  setBreakfastVegetable: (value: string) => void;
  breakfastVegetablePortion: string;
  setBreakfastVegetablePortion: (value: string) => void;
  
  lunchProtein: string;
  setLunchProtein: (value: string) => void;
  lunchProteinPortion: string;
  setLunchProteinPortion: (value: string) => void;
  lunchFruit: string;
  setLunchFruit: (value: string) => void;
  lunchFruitPortion: string;
  setLunchFruitPortion: (value: string) => void;
  lunchVegetable: string;
  setLunchVegetable: (value: string) => void;
  lunchVegetablePortion: string;
  setLunchVegetablePortion: (value: string) => void;
  
  dinnerProtein: string;
  setDinnerProtein: (value: string) => void;
  dinnerProteinPortion: string;
  setDinnerProteinPortion: (value: string) => void;
  dinnerFruit: string;
  setDinnerFruit: (value: string) => void;
  dinnerFruitPortion: string;
  setDinnerFruitPortion: (value: string) => void;
  dinnerVegetable: string;
  setDinnerVegetable: (value: string) => void;
  dinnerVegetablePortion: string;
  setDinnerVegetablePortion: (value: string) => void;
  
  snacks: string;
  setSnacks: (value: string) => void;
  snackPortion: string;
  setSnackPortion: (value: string) => void;
}

const NutritionTab: React.FC<NutritionTabProps> = ({
  breakfastProtein, setBreakfastProtein,
  breakfastProteinPortion, setBreakfastProteinPortion,
  breakfastFruit, setBreakfastFruit,
  breakfastFruitPortion, setBreakfastFruitPortion,
  breakfastVegetable, setBreakfastVegetable,
  breakfastVegetablePortion, setBreakfastVegetablePortion,
  
  lunchProtein, setLunchProtein,
  lunchProteinPortion, setLunchProteinPortion,
  lunchFruit, setLunchFruit,
  lunchFruitPortion, setLunchFruitPortion,
  lunchVegetable, setLunchVegetable,
  lunchVegetablePortion, setLunchVegetablePortion,
  
  dinnerProtein, setDinnerProtein,
  dinnerProteinPortion, setDinnerProteinPortion,
  dinnerFruit, setDinnerFruit,
  dinnerFruitPortion, setDinnerFruitPortion,
  dinnerVegetable, setDinnerVegetable,
  dinnerVegetablePortion, setDinnerVegetablePortion,
  
  snacks, setSnacks,
  snackPortion, setSnackPortion
}) => {
  return (
    <div className="space-y-6">
      {/* Breakfast */}
      <MealSection 
        title="Breakfast"
        protein={breakfastProtein}
        setProtein={setBreakfastProtein}
        proteinPortion={breakfastProteinPortion}
        setProteinPortion={setBreakfastProteinPortion}
        fruit={breakfastFruit}
        setFruit={setBreakfastFruit}
        fruitPortion={breakfastFruitPortion}
        setFruitPortion={setBreakfastFruitPortion}
        vegetable={breakfastVegetable}
        setVegetable={setBreakfastVegetable}
        vegetablePortion={breakfastVegetablePortion}
        setVegetablePortion={setBreakfastVegetablePortion}
      />
      
      {/* Lunch */}
      <MealSection 
        title="Lunch"
        protein={lunchProtein}
        setProtein={setLunchProtein}
        proteinPortion={lunchProteinPortion}
        setProteinPortion={setLunchProteinPortion}
        fruit={lunchFruit}
        setFruit={setLunchFruit}
        fruitPortion={lunchFruitPortion}
        setFruitPortion={setLunchFruitPortion}
        vegetable={lunchVegetable}
        setVegetable={setLunchVegetable}
        vegetablePortion={lunchVegetablePortion}
        setVegetablePortion={setLunchVegetablePortion}
      />
      
      {/* Dinner */}
      <MealSection 
        title="Dinner"
        protein={dinnerProtein}
        setProtein={setDinnerProtein}
        proteinPortion={dinnerProteinPortion}
        setProteinPortion={setDinnerProteinPortion}
        fruit={dinnerFruit}
        setFruit={setDinnerFruit}
        fruitPortion={dinnerFruitPortion}
        setFruitPortion={setDinnerFruitPortion}
        vegetable={dinnerVegetable}
        setVegetable={setDinnerVegetable}
        vegetablePortion={dinnerVegetablePortion}
        setVegetablePortion={setDinnerVegetablePortion}
      />
      
      {/* Snacks */}
      <div>
        <h3 className="font-medium mb-3">Snacks</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="snacks">Snacks</Label>
              <Textarea
                id="snacks"
                placeholder="List any snacks you had today"
                value={snacks}
                onChange={(e) => setSnacks(e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="snackPortion">Portion (oz)</Label>
              <Input
                id="snackPortion"
                type="number"
                placeholder="Total snack portions"
                value={snackPortion}
                onChange={(e) => setSnackPortion(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTab;
