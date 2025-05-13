import React from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onRangePresetChange: (preset: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRangePresetChange,
}) => {
  const handlePresetChange = (value: string) => {
    onRangePresetChange(value);
    
    const today = new Date();
    
    switch (value) {
      case 'last7days':
        onStartDateChange(subDays(today, 7));
        onEndDateChange(today);
        break;
      case 'last30days':
        onStartDateChange(subDays(today, 30));
        onEndDateChange(today);
        break;
      case 'last3months':
        onStartDateChange(subMonths(today, 3));
        onEndDateChange(today);
        break;
      case 'last6months':
        onStartDateChange(subMonths(today, 6));
        onEndDateChange(today);
        break;
      case 'custom':
        // Keep current dates, just change the mode
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <Select onValueChange={handlePresetChange} defaultValue="last30days">
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="last7days">Last 7 days</SelectItem>
          <SelectItem value="last30days">Last 30 days</SelectItem>
          <SelectItem value="last3months">Last 3 months</SelectItem>
          <SelectItem value="last6months">Last 6 months</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(startDate, 'MMM d, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && onStartDateChange(date)}
              disabled={(date) => date > endDate || date > new Date()}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        
        <span className="text-gray-500">to</span>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(endDate, 'MMM d, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && onEndDateChange(date)}
              disabled={(date) => date < startDate || date > new Date()}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;
