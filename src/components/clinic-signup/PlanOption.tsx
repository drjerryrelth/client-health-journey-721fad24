
import React from 'react';
import { Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface PlanOptionProps {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  selected: boolean;
  onSelect: () => void;
}

const PlanOption = ({
  id,
  name,
  description,
  price,
  features,
  selected,
  onSelect,
}: PlanOptionProps) => {
  return (
    <div 
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all",
        selected 
          ? "border-primary bg-primary/5 shadow-sm" 
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start">
        <RadioGroupItem 
          value={id} 
          id={`plan-${id}`} 
          className="mt-1 mr-2"
          checked={selected}
          onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <Label htmlFor={`plan-${id}`} className="text-lg font-medium cursor-pointer">
              {name}
            </Label>
            <div className="text-lg font-bold text-primary">{price}</div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <ul className="mt-3 space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanOption;
