
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  setVegetablePortion
}) => {
  return (
    <div className="border-b pb-4">
      <h3 className="font-medium mb-3">{title}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${title.toLowerCase()}Protein`}>Protein</Label>
            <Input
              id={`${title.toLowerCase()}Protein`}
              placeholder={title === "Breakfast" ? "E.g., eggs, protein shake" : title === "Lunch" ? "E.g., chicken, fish" : "E.g., beef, tofu"}
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`${title.toLowerCase()}ProteinPortion`}>Portion (oz)</Label>
            <Input
              id={`${title.toLowerCase()}ProteinPortion`}
              type="number"
              placeholder="Portion size"
              value={proteinPortion}
              onChange={(e) => setProteinPortion(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${title.toLowerCase()}Fruit`}>Fruit</Label>
            <Input
              id={`${title.toLowerCase()}Fruit`}
              placeholder={title === "Breakfast" ? "E.g., apple, berries" : title === "Lunch" ? "E.g., orange, grapes" : "E.g., pear, melon"}
              value={fruit}
              onChange={(e) => setFruit(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`${title.toLowerCase()}FruitPortion`}>Portion (oz)</Label>
            <Input
              id={`${title.toLowerCase()}FruitPortion`}
              type="number"
              placeholder="Portion size"
              value={fruitPortion}
              onChange={(e) => setFruitPortion(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${title.toLowerCase()}Vegetable`}>Vegetable</Label>
            <Input
              id={`${title.toLowerCase()}Vegetable`}
              placeholder={title === "Breakfast" ? "E.g., spinach, tomatoes" : title === "Lunch" ? "E.g., salad, broccoli" : "E.g., asparagus, carrots"}
              value={vegetable}
              onChange={(e) => setVegetable(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`${title.toLowerCase()}VegetablePortion`}>Portion (oz)</Label>
            <Input
              id={`${title.toLowerCase()}VegetablePortion`}
              type="number"
              placeholder="Portion size"
              value={vegetablePortion}
              onChange={(e) => setVegetablePortion(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealSection;
