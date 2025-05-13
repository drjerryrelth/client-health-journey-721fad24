
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientSelectorProps {
  clients: any[];
  selectedClientId: string | null;
  onChange: (clientId: string) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ clients, selectedClientId, onChange }) => {
  return (
    <div className="w-full md:w-72">
      <Select
        value={selectedClientId || undefined}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select client" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
