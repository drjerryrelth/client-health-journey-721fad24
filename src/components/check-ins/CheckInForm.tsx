
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Weight, Activity, Droplets, Apple, Clock, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";

const CheckInForm = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("measurements");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [weight, setWeight] = useState("");
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [moodLevel, setMoodLevel] = useState([5]);
  const [waterIntake, setWaterIntake] = useState("64");
  const [exercise, setExercise] = useState("");
  const [exerciseTime, setExerciseTime] = useState("");
  const [exerciseType, setExerciseType] = useState("steps");
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would send data to the server
    setTimeout(() => {
      toast({
        title: "Check-in submitted",
        description: "Your daily check-in has been recorded successfully.",
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
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="measurements" className="flex items-center space-x-2">
                <Weight size={16} />
                <span className="hidden sm:inline">Measurements</span>
              </TabsTrigger>
              <TabsTrigger value="wellness" className="flex items-center space-x-2">
                <Activity size={16} />
                <span className="hidden sm:inline">Wellness</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center space-x-2">
                <Apple size={16} />
                <span className="hidden sm:inline">Nutrition</span>
              </TabsTrigger>
              <TabsTrigger value="supplements" className="flex items-center space-x-2">
                <BookOpen size={16} />
                <span className="hidden sm:inline">Supplements</span>
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="measurements" className="space-y-6">
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
              </TabsContent>
              
              <TabsContent value="wellness" className="space-y-6">
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
                </div>
              </TabsContent>
              
              <TabsContent value="nutrition" className="space-y-6">
                <div className="space-y-6">
                  {/* Breakfast */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-3">Breakfast</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="breakfastProtein">Protein</Label>
                          <Input
                            id="breakfastProtein"
                            placeholder="E.g., eggs, protein shake"
                            value={breakfastProtein}
                            onChange={(e) => setBreakfastProtein(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="breakfastProteinPortion">Portion (oz)</Label>
                          <Input
                            id="breakfastProteinPortion"
                            type="number"
                            placeholder="Portion size"
                            value={breakfastProteinPortion}
                            onChange={(e) => setBreakfastProteinPortion(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="breakfastFruit">Fruit</Label>
                          <Input
                            id="breakfastFruit"
                            placeholder="E.g., apple, berries"
                            value={breakfastFruit}
                            onChange={(e) => setBreakfastFruit(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="breakfastFruitPortion">Portion (oz)</Label>
                          <Input
                            id="breakfastFruitPortion"
                            type="number"
                            placeholder="Portion size"
                            value={breakfastFruitPortion}
                            onChange={(e) => setBreakfastFruitPortion(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="breakfastVegetable">Vegetable</Label>
                          <Input
                            id="breakfastVegetable"
                            placeholder="E.g., spinach, tomatoes"
                            value={breakfastVegetable}
                            onChange={(e) => setBreakfastVegetable(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="breakfastVegetablePortion">Portion (oz)</Label>
                          <Input
                            id="breakfastVegetablePortion"
                            type="number"
                            placeholder="Portion size"
                            value={breakfastVegetablePortion}
                            onChange={(e) => setBreakfastVegetablePortion(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lunch */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-3">Lunch</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lunchProtein">Protein</Label>
                          <Input
                            id="lunchProtein"
                            placeholder="E.g., chicken, fish"
                            value={lunchProtein}
                            onChange={(e) => setLunchProtein(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lunchProteinPortion">Portion (oz)</Label>
                          <Input
                            id="lunchProteinPortion"
                            type="number"
                            placeholder="Portion size"
                            value={lunchProteinPortion}
                            onChange={(e) => setLunchProteinPortion(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lunchFruit">Fruit</Label>
                          <Input
                            id="lunchFruit"
                            placeholder="E.g., orange, grapes"
                            value={lunchFruit}
                            onChange={(e) => setLunchFruit(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lunchFruitPortion">Portion (oz)</Label>
                          <Input
                            id="lunchFruitPortion"
                            type="number"
                            placeholder="Portion size"
                            value={lunchFruitPortion}
                            onChange={(e) => setLunchFruitPortion(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lunchVegetable">Vegetable</Label>
                          <Input
                            id="lunchVegetable"
                            placeholder="E.g., salad, broccoli"
                            value={lunchVegetable}
                            onChange={(e) => setLunchVegetable(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lunchVegetablePortion">Portion (oz)</Label>
                          <Input
                            id="lunchVegetablePortion"
                            type="number"
                            placeholder="Portion size"
                            value={lunchVegetablePortion}
                            onChange={(e) => setLunchVegetablePortion(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dinner */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-3">Dinner</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dinnerProtein">Protein</Label>
                          <Input
                            id="dinnerProtein"
                            placeholder="E.g., beef, tofu"
                            value={dinnerProtein}
                            onChange={(e) => setDinnerProtein(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dinnerProteinPortion">Portion (oz)</Label>
                          <Input
                            id="dinnerProteinPortion"
                            type="number"
                            placeholder="Portion size"
                            value={dinnerProteinPortion}
                            onChange={(e) => setDinnerProteinPortion(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dinnerFruit">Fruit</Label>
                          <Input
                            id="dinnerFruit"
                            placeholder="E.g., pear, melon"
                            value={dinnerFruit}
                            onChange={(e) => setDinnerFruit(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dinnerFruitPortion">Portion (oz)</Label>
                          <Input
                            id="dinnerFruitPortion"
                            type="number"
                            placeholder="Portion size"
                            value={dinnerFruitPortion}
                            onChange={(e) => setDinnerFruitPortion(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dinnerVegetable">Vegetable</Label>
                          <Input
                            id="dinnerVegetable"
                            placeholder="E.g., asparagus, carrots"
                            value={dinnerVegetable}
                            onChange={(e) => setDinnerVegetable(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dinnerVegetablePortion">Portion (oz)</Label>
                          <Input
                            id="dinnerVegetablePortion"
                            type="number"
                            placeholder="Portion size"
                            value={dinnerVegetablePortion}
                            onChange={(e) => setDinnerVegetablePortion(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
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
              </TabsContent>
              
              <TabsContent value="supplements" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="supplements">Supplements Taken Today</Label>
                    <Textarea
                      id="supplements"
                      placeholder="List supplements and time taken (e.g., Multivitamin - morning, Magnesium - evening)"
                      value={supplements}
                      onChange={(e) => setSupplements(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="generalNotes">Additional Notes</Label>
                    <Textarea
                      id="generalNotes"
                      placeholder="Any additional notes about your progress today?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <div className="mt-8 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const tabs = ["measurements", "wellness", "nutrition", "supplements"];
                    const currentIndex = tabs.indexOf(currentTab);
                    if (currentIndex > 0) {
                      setCurrentTab(tabs[currentIndex - 1]);
                    }
                  }}
                  disabled={currentTab === "measurements" || isSubmitting}
                >
                  Previous
                </Button>
                
                {currentTab !== "supplements" ? (
                  <Button 
                    type="button" 
                    onClick={() => {
                      const tabs = ["measurements", "wellness", "nutrition", "supplements"];
                      const currentIndex = tabs.indexOf(currentTab);
                      if (currentIndex < 3) {
                        setCurrentTab(tabs[currentIndex + 1]);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent border-white rounded-full"></span>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Check-in"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInForm;
