
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
import { Weight, Activity, Droplets, Apple, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CheckInForm = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("measurements");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [moodLevel, setMoodLevel] = useState([5]);
  const [waterIntake, setWaterIntake] = useState("64");
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
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
              <TabsTrigger value="photos" className="flex items-center space-x-2">
                <Camera size={16} />
                <span className="hidden sm:inline">Photos</span>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="waist">Waist (inches)</Label>
                      <Input
                        id="waist"
                        type="number"
                        step="0.1"
                        placeholder="Waist measurement"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hips">Hips (inches)</Label>
                      <Input
                        id="hips"
                        type="number"
                        step="0.1"
                        placeholder="Hip measurement"
                        value={hips}
                        onChange={(e) => setHips(e.target.value)}
                      />
                    </div>
                  </div>
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
                </div>
              </TabsContent>
              
              <TabsContent value="nutrition" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="breakfast">Breakfast</Label>
                    <Textarea
                      id="breakfast"
                      placeholder="What did you eat for breakfast?"
                      value={breakfast}
                      onChange={(e) => setBreakfast(e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lunch">Lunch</Label>
                    <Textarea
                      id="lunch"
                      placeholder="What did you eat for lunch?"
                      value={lunch}
                      onChange={(e) => setLunch(e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dinner">Dinner</Label>
                    <Textarea
                      id="dinner"
                      placeholder="What did you eat for dinner?"
                      value={dinner}
                      onChange={(e) => setDinner(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="photos" className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <Label className="block mb-3">Progress Photos</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Front Photo</p>
                        <p className="text-xs text-gray-400 mt-1">Click or drag and drop</p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Side Photo</p>
                        <p className="text-xs text-gray-400 mt-1">Click or drag and drop</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
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
                    const currentIndex = ["measurements", "wellness", "nutrition", "photos"].indexOf(currentTab);
                    if (currentIndex > 0) {
                      setCurrentTab(["measurements", "wellness", "nutrition", "photos"][currentIndex - 1]);
                    }
                  }}
                  disabled={currentTab === "measurements" || isSubmitting}
                >
                  Previous
                </Button>
                
                {currentTab !== "photos" ? (
                  <Button 
                    type="button" 
                    onClick={() => {
                      const currentIndex = ["measurements", "wellness", "nutrition", "photos"].indexOf(currentTab);
                      if (currentIndex < 3) {
                        setCurrentTab(["measurements", "wellness", "nutrition", "photos"][currentIndex + 1]);
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
