
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CoachesFilterProps {
  onFilterChange: (filters: { search: string; status: string; clinic: string }) => void;
  clinics: Record<string, string>;
}

const CoachesFilter: React.FC<CoachesFilterProps> = ({ onFilterChange, clinics }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clinicFilter, setClinicFilter] = useState('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    onFilterChange({ search: newSearch, status: statusFilter, clinic: clinicFilter });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange({ search, status: value, clinic: clinicFilter });
  };

  const handleClinicChange = (value: string) => {
    setClinicFilter(value);
    onFilterChange({ search, status: statusFilter, clinic: value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search coaches by name or email..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-4">
        <div className="w-32 md:w-40">
          <Label htmlFor="status-filter" className="text-xs mb-1 block">Status</Label>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-32 md:w-40">
          <Label htmlFor="clinic-filter" className="text-xs mb-1 block">Clinic</Label>
          <Select value={clinicFilter} onValueChange={handleClinicChange}>
            <SelectTrigger id="clinic-filter">
              <SelectValue placeholder="Filter by clinic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clinics</SelectItem>
              {Object.entries(clinics).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CoachesFilter;
