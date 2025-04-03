
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CoachesFilterProps {
  filterText: string;
  setFilterText: (text: string) => void;
  count: number;
}

const CoachesFilter: React.FC<CoachesFilterProps> = ({ filterText, setFilterText, count }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search coaches by name or email..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10"
          />
        </div>
        <span className="text-sm text-muted-foreground ml-2 hidden md:inline">
          {count} {count === 1 ? 'coach' : 'coaches'} found
        </span>
      </div>
      <div className="md:hidden text-sm text-muted-foreground">
        {count} {count === 1 ? 'coach' : 'coaches'} found
      </div>
    </div>
  );
};

export default CoachesFilter;
