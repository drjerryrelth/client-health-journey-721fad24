
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from "@/components/ui/slider";

interface WellnessTabProps {
  energyLevel: number[];
  setEnergyLevel: (value: number[]) => void;
  moodLevel: number[];
  setMoodLevel: (value: number[]) => void;
  sleepHours: string;
  setSleepHours: (value: string) => void;
}

const WellnessTab: React.FC<WellnessTabProps> = ({
  energyLevel,
  setEnergyLevel,
  moodLevel,
  setMoodLevel,
  sleepHours,
  setSleepHours
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <Label>Energy Level (1-10)</Label>
          <span className="text-primary-600 font-medium">{energyLevel[0]}/10</span>
        </div>
        <Slider
          defaultValue={[5]}
          max={10}
          min={1}
          step={1}
          value={energyLevel}
          onValueChange={setEnergyLevel}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low Energy</span>
          <span>High Energy</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <Label>Mood (1-10)</Label>
          <span className="text-primary-600 font-medium">{moodLevel[0]}/10</span>
        </div>
        <Slider
          defaultValue={[5]}
          max={10}
          min={1}
          step={1}
          value={moodLevel}
          onValueChange={setMoodLevel}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Poor Mood</span>
          <span>Great Mood</span>
        </div>
      </div>
      
      <div>
        <Label htmlFor="sleepHours">Last Night's Sleep (hours)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="sleepHours"
            type="number"
            placeholder="Hours of sleep"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            className="max-w-[120px]"
            min="0"
            max="24"
            step="0.5"
          />
          <span className="text-sm text-gray-500">hours</span>
        </div>
      </div>
    </div>
  );
};

export default WellnessTab;
