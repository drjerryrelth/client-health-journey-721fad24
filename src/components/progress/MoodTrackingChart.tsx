
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Smile } from 'lucide-react';

interface MoodTrackingChartProps {
  data: any[];
}

const MoodTrackingChart: React.FC<MoodTrackingChartProps> = ({ data }) => {
  // Format data for the chart
  const chartData = data
    .filter((item) => item.mood_score !== null && item.mood_score !== undefined)
    .map((item) => ({
      date: item.date,
      score: item.mood_score || 0,
      formattedDate: format(new Date(item.date), 'MMM dd')
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <p>No mood data available</p>
      </div>
    );
  }

  // Calculate average mood score
  const totalScore = chartData.reduce((sum, item) => sum + item.score, 0);
  const averageScore = totalScore / chartData.length;
  
  // Get mood description based on average score
  const getMoodDescription = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Fair";
    if (score >= 1.5) return "Poor";
    return "Very poor";
  };
  
  // Get emoji based on score
  const getMoodEmoji = (score: number) => {
    if (score >= 4.5) return "😀";
    if (score >= 3.5) return "🙂";
    if (score >= 2.5) return "😐";
    if (score >= 1.5) return "🙁";
    return "😞";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Mood</p>
              <h3 className="text-2xl font-bold">{getMoodDescription(averageScore)}</h3>
            </div>
            <Smile className="h-10 w-10 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Mood Trend</p>
            <div className="flex items-center gap-1 mt-1 text-3xl">
              {chartData.slice(-3).map((item, i) => (
                <span key={i}>{getMoodEmoji(item.score)}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="formattedDate" />
            <YAxis 
              domain={[1, 5]} 
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => {
                const labels = {
                  1: "Very Poor",
                  2: "Poor",
                  3: "Fair",
                  4: "Good",
                  5: "Excellent"
                };
                return labels[value as keyof typeof labels] || value;
              }}
            />
            <Tooltip
              formatter={(value) => [`${value}/5`, 'Mood Score']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#eab308"
              strokeWidth={2}
              dot={{ stroke: '#eab308', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#a16207', strokeWidth: 2, fill: '#eab308' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <p className="text-sm font-medium">Mood insights:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>Your average mood is {averageScore.toFixed(1)}/5 ({getMoodDescription(averageScore)})</li>
          <li>Your best day was {chartData.reduce((max, item) => item.score > max.score ? item : max, chartData[0]).formattedDate}</li>
          <li>
            {averageScore >= 4 
              ? 'You\'ve been feeling great lately!' 
              : averageScore >= 3 
              ? 'Your mood has been mostly positive.' 
              : 'Consider talking to your coach about improving your mood.'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MoodTrackingChart;
