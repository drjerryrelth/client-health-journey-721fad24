
import React from 'react';
import { ClientDataContext } from '@/components/client/context/ClientDataContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Droplet, Moon, Activity, Smile, Search } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { CheckIn } from '@/types';

// Mock data generation
const generateMockCheckIns = (): CheckIn[] => {
  const today = new Date();
  
  return Array(14).fill(null).map((_, index) => {
    const date = subDays(today, 13 - index);
    const dateStr = date.toISOString().split('T')[0];
    const weight = 170 - Math.random() * 3 * index;
    
    return {
      id: `mock-${index}`,
      clientId: 'mock-client',
      date: dateStr,
      weight: Math.round(weight * 10) / 10,
      measurements: {
        waist: Math.round((32 - Math.random() * index * 0.2) * 10) / 10,
        hips: Math.round((38 - Math.random() * index * 0.1) * 10) / 10,
        chest: Math.round((40 - Math.random() * index * 0.1) * 10) / 10,
        thighs: Math.round((22 - Math.random() * index * 0.05) * 10) / 10,
        arms: Math.round((14 - Math.random() * index * 0.05) * 10) / 10,
      },
      moodScore: Math.round(6 + Math.random() * 4),
      energyScore: Math.round(5 + Math.random() * 5),
      sleepHours: Math.round((6 + Math.random() * 3) * 10) / 10,
      waterIntake: Math.round(5 + Math.random() * 4),
      meals: {
        breakfast: ['Oatmeal with berries', 'Greek yogurt with honey', 'Avocado toast with eggs'][index % 3],
        lunch: ['Grilled chicken salad', 'Turkey and avocado wrap', 'Quinoa bowl with vegetables'][index % 3],
        dinner: ['Baked salmon with sweet potato', 'Stir-fry with brown rice', 'Lean steak with roasted vegetables'][index % 3],
        snacks: ['Apple with almond butter', 'Greek yogurt with berries', 'Protein bar'][index % 3],
      },
      notes: index % 3 === 0 ? "Feeling great today! Workout was excellent." : "",
      photos: [],
    };
  });
};

const CheckInHistoryTable = () => {
  const { checkIns } = React.useContext(ClientDataContext);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Use real data if available, otherwise use mock data
  const data = React.useMemo(() => {
    if (checkIns && checkIns.length > 0) {
      return checkIns;
    }
    return generateMockCheckIns();
  }, [checkIns]);
  
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      
      // Search in date, measurements, and notes
      return (
        new Date(item.date).toLocaleDateString().includes(searchLower) ||
        (item.notes && item.notes.toLowerCase().includes(searchLower)) ||
        (item.meals?.breakfast && item.meals.breakfast.toLowerCase().includes(searchLower)) ||
        (item.meals?.lunch && item.meals.lunch.toLowerCase().includes(searchLower)) ||
        (item.meals?.dinner && item.meals.dinner.toLowerCase().includes(searchLower)) ||
        (item.meals?.snacks && item.meals.snacks.toLowerCase().includes(searchLower))
      );
    });
  }, [data, searchTerm]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setSearchTerm('')}>
          Clear
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-left py-3 px-2">Date</th>
              <th className="text-left py-3 px-2">Weight</th>
              <th className="text-left py-3 px-2">Waist</th>
              <th className="text-left py-3 px-2">Wellness</th>
              <th className="text-left py-3 px-2">Water</th>
              <th className="text-left py-3 px-2">Meals</th>
              <th className="text-left py-3 px-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((checkIn) => (
              <tr key={checkIn.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">{format(new Date(checkIn.date), 'EEE, MMM d')}</td>
                <td className="py-3 px-2">{checkIn.weight ? `${checkIn.weight} lbs` : '-'}</td>
                <td className="py-3 px-2">{checkIn.measurements?.waist ? `${checkIn.measurements.waist} in` : '-'}</td>
                <td className="py-3 px-2">
                  <div className="flex space-x-2">
                    {checkIn.energyScore && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Activity size={12} className="text-green-500" />
                        {checkIn.energyScore}
                      </Badge>
                    )}
                    
                    {checkIn.moodScore && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Smile size={12} className="text-yellow-500" />
                        {checkIn.moodScore}
                      </Badge>
                    )}
                    
                    {checkIn.sleepHours && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Moon size={12} className="text-blue-500" />
                        {checkIn.sleepHours}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2">
                  {checkIn.waterIntake ? (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Droplet size={12} className="text-blue-500" />
                      {checkIn.waterIntake}
                    </Badge>
                  ) : '-'}
                </td>
                <td className="py-3 px-2 max-w-xs">
                  {checkIn.meals ? (
                    <div className="text-xs text-gray-600 truncate">
                      {checkIn.meals.breakfast && <span className="font-medium">B:</span>} {checkIn.meals.breakfast}
                    </div>
                  ) : '-'}
                </td>
                <td className="py-3 px-2 max-w-xs">
                  <div className="text-xs text-gray-600 truncate">{checkIn.notes || '-'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No check-ins match your search. Try adjusting your filters.
        </div>
      )}
    </div>
  );
};

export default CheckInHistoryTable;
