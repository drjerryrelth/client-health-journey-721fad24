import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const MyProgram = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Program</h1>
        <p className="text-gray-500">Your current wellness program details and recommendations</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Guide</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Practice Naturals</span>
                <Badge className="bg-green-500">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Program Description</h3>
                  <p className="text-gray-600">
                    The Practice Naturals program is designed to help you achieve optimal health through natural nutrition, 
                    targeted supplementation, and lifestyle changes. This holistic approach focuses on sustainable wellness 
                    habits that you can maintain for life.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Program Goals</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Achieve and maintain a healthy weight</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Improve energy levels and mental clarity</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Develop sustainable eating habits</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Balance hormones and improve metabolism</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800">Important Reminder</h4>
                      <p className="text-sm text-amber-700">
                        Complete your daily check-in to track your progress and get personalized recommendations
                        from your coach. Consistent check-ins lead to better results!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Food Preparation Rules</h3>
                  <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                    <h4 className="font-medium text-amber-800 mb-2">Important Food Prep Guidelines</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Avoid cooking oils</strong> - Use dry rubs and seasonings instead</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>For salads, avoid dairy-based dressings</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>If needed, use only 1 tablespoon of olive oil or avocado oil for salad dressing</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Recommended cooking methods: grilling, baking, steaming, or poaching</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Recommended Foods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-primary-600 mb-2">Proteins</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✓ Organic chicken & turkey</li>
                        <li>✓ Wild-caught fish (salmon, cod)</li>
                        <li>✓ Grass-fed beef (limited)</li>
                        <li>✓ Eggs</li>
                        <li>✓ Plant-based proteins (tempeh, tofu)</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-primary-600 mb-2">Vegetables</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✓ Leafy greens (spinach, kale)</li>
                        <li>✓ Cruciferous (broccoli, cauliflower)</li>
                        <li>✓ Bell peppers</li>
                        <li>✓ Cucumber, celery</li>
                        <li>✓ Asparagus</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium text-primary-600 mb-2">Fruits</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✓ Berries (all types)</li>
                        <li>✓ Green apples</li>
                        <li>✓ Citrus fruits (limited)</li>
                        <li>✓ Avocado</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Foods to Avoid</h3>
                  <div className="border rounded-lg p-4 bg-red-50">
                    <ul className="space-y-1">
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Processed foods with added sugars</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Refined carbohydrates (white bread, pasta)</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Artificial sweeteners and additives</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Fried foods and poor quality oils</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Portion Guidelines</h3>
                  <div className="border rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">Protein</h4>
                        <p className="text-sm text-gray-600">Palm-sized portion (4-6 oz) at each meal</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Vegetables</h4>
                        <p className="text-sm text-gray-600">Fill half your plate with non-starchy vegetables</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Fruits</h4>
                        <p className="text-sm text-gray-600">1-2 servings daily, fist-sized portion</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Healthy Fats</h4>
                        <p className="text-sm text-gray-600">Thumb-sized portion (1-2 tbsp) per meal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="supplements">
          <Card>
            <CardHeader>
              <CardTitle>Supplement Protocol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray-600">
                  The following supplements have been recommended for your program. Always take as directed and consult
                  with your healthcare provider before making changes.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-primary-600">Metabolic Booster</h4>
                    <p className="text-sm text-gray-600 mb-2">Supports metabolism and energy production</p>
                    <div className="flex justify-between text-sm">
                      <span>Dosage: 2 capsules</span>
                      <span className="text-primary-600">Morning, with food</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-primary-600">Omega Complex</h4>
                    <p className="text-sm text-gray-600 mb-2">Supports brain health and reduces inflammation</p>
                    <div className="flex justify-between text-sm">
                      <span>Dosage: 2 soft gels</span>
                      <span className="text-primary-600">Evening, with dinner</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-primary-600">MultiVitamin</h4>
                    <p className="text-sm text-gray-600 mb-2">Comprehensive nutrient support</p>
                    <div className="flex justify-between text-sm">
                      <span>Dosage: 1 tablet</span>
                      <span className="text-primary-600">Morning, with food</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-primary-600">Probiotic</h4>
                    <p className="text-sm text-gray-600 mb-2">Gut health and digestion support</p>
                    <div className="flex justify-between text-sm">
                      <span>Dosage: 1 capsule</span>
                      <span className="text-primary-600">Morning, before food</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Program Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray-600">
                  Your program is scheduled to run for 42 days. Below is an overview of key milestones and check-ins.
                </p>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focus Area</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach Check-in</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Week 1</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Foundation Building</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Initial + Day 7</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Week 2</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nutrition Optimization</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Day 14</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Week 3</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Habit Formation</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Day 21</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Week 4</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Progress Assessment</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Day 28</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Week 5</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Fine Tuning</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Day 35</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Week 6</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maintenance Strategy</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Day 42 (Final)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProgram;
