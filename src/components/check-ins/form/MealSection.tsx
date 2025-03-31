
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import NutritionGuidanceCard from "./NutritionGuidanceCard";

interface MealSectionProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

const MealSection: React.FC<MealSectionProps> = ({ title, value, onChange, mealType }) => {
  // Only show nutrition guidance for main meals, not snacks
  const showGuidance = mealType !== 'snacks';

  return (
    <div className="space-y-2 mb-6">
      <Label htmlFor={mealType}>{title}</Label>
      
      {showGuidance && <NutritionGuidanceCard mealType={mealType} />}
      
      <Textarea
        id={mealType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`What did you eat for ${title.toLowerCase()}?`}
        rows={3}
      />
    </div>
  );
};

export default MealSection;
