
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import NutritionGuidanceCard from "./NutritionGuidanceCard";

interface MealSectionProps {
  title: string;
  protein: string;
  setProtein: (value: string) => void;
  proteinPortion: string;
  setProteinPortion: (value: string) => void;
  fruit: string;
  setFruit: (value: string) => void;
  fruitPortion: string;
  setFruitPortion: (value: string) => void;
  vegetable: string;
  setVegetable: (value: string) => void;
  vegetablePortion: string;
  setVegetablePortion: (value: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

const MealSection: React.FC<MealSectionProps> = ({ 
  title, 
  protein, 
  setProtein,
  proteinPortion,
  setProteinPortion,
  fruit,
  setFruit,
  fruitPortion,
  setFruitPortion,
  vegetable,
  setVegetable,
  vegetablePortion,
  setVegetablePortion,
  value,
  onChange,
  mealType = title.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snacks'
}) => {
  // Only show nutrition guidance for main meals, not snacks
  const showGuidance = mealType !== 'snacks';
  
  const mealId = mealType.toLowerCase();
  
  return (
    <div className="space-y-4 mb-6">
      <h3 className="font-medium text-lg">{title}</h3>
      
      {showGuidance && <NutritionGuidanceCard mealType={mealType} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${mealId}-protein`}>Protein</Label>
          <Textarea
            id={`${mealId}-protein`}
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder={`What protein did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor={`${mealId}-protein-portion`}>Protein Portion (oz)</Label>
          <Input
            id={`${mealId}-protein-portion`}
            type="number"
            value={proteinPortion}
            onChange={(e) => setProteinPortion(e.target.value)}
            placeholder="Portion size"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${mealId}-fruit`}>Fruit</Label>
          <Textarea
            id={`${mealId}-fruit`}
            value={fruit}
            onChange={(e) => setFruit(e.target.value)}
            placeholder={`What fruit did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor={`${mealId}-fruit-portion`}>Fruit Portion (oz)</Label>
          <Input
            id={`${mealId}-fruit-portion`}
            type="number"
            value={fruitPortion}
            onChange={(e) => setFruitPortion(e.target.value)}
            placeholder="Portion size"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${mealId}-vegetable`}>Vegetables</Label>
          <Textarea
            id={`${mealId}-vegetable`}
            value={vegetable}
            onChange={(e) => setVegetable(e.target.value)}
            placeholder={`What vegetables did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor={`${mealId}-vegetable-portion`}>Vegetable Portion (oz)</Label>
          <Input
            id={`${mealId}-vegetable-portion`}
            type="number"
            value={vegetablePortion}
            onChange={(e) => setVegetablePortion(e.target.value)}
            placeholder="Portion size"
          />
        </div>
      </div>
    </div>
  );
};

export default MealSection;
