
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Droplets } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MeasurementsTabProps {
  weight: string;
  setWeight: (value: string) => void;
  waterIntake: string;
  setWaterIntake: (value: string) => void;
  exerciseType: string;
  setExerciseType: (value: string) => void;
  exercise: string;
  setExercise: (value: string) => void;
  exerciseTime: string;
  setExerciseTime: (value: string) => void;
}

const MeasurementsTab: React.FC<MeasurementsTabProps> = ({
  weight,
  setWeight,
  waterIntake,
  setWaterIntake,
  exerciseType,
  setExerciseType,
  exercise,
  setExercise,
  exerciseTime,
  setExerciseTime
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="weight">Weight (lbs)</Label>
        <Input
          id="weight"
          type="number"
          placeholder="Enter your current weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="water">Water Intake (oz)</Label>
          <div className="flex items-center text-primary-600">
            <Droplets size={16} className="mr-1" />
            <span className="font-medium">{waterIntake} oz</span>
          </div>
        </div>
        <Input
          id="water"
          type="number"
          value={waterIntake}
          onChange={(e) => setWaterIntake(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="exerciseType">Exercise Type</Label>
        <Select
          value={exerciseType}
          onValueChange={(value) => setExerciseType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select exercise type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="steps">Steps</SelectItem>
            <SelectItem value="walking">Walking</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="cycling">Cycling</SelectItem>
            <SelectItem value="swimming">Swimming</SelectItem>
            <SelectItem value="hiking">Hiking</SelectItem>
            <SelectItem value="yoga">Yoga</SelectItem>
            <SelectItem value="strength">Strength Training</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {exerciseType === "steps" ? (
        <div>
          <Label htmlFor="steps">Daily Steps</Label>
          <Input
            id="steps"
            type="number"
            placeholder="Enter your daily steps"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="exercise">Exercise Description</Label>
            <Textarea
              id="exercise"
              placeholder="Describe your exercise"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="exerciseTime">Duration (minutes)</Label>
            <Input
              id="exerciseTime"
              type="number"
              placeholder="How long did you exercise?"
              value={exerciseTime}
              onChange={(e) => setExerciseTime(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementsTab;
