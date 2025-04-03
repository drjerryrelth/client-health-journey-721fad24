
import React from 'react';
import { Client } from '@/types';

interface ClientListItemProps {
  client: Client;
  onClick: (clientId: string) => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({ client, onClick }) => {
  return (
    <div 
      key={client.id} 
      className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(client.id)}
    >
      <div>
        <h3 className="font-medium">{client.name}</h3>
        <p className="text-sm text-gray-500">{client.email}</p>
      </div>
      <div className="text-sm text-gray-500">
        Last check-in: {client.lastCheckIn ? new Date(client.lastCheckIn).toLocaleDateString() : 'Never'}
      </div>
    </div>
  );
};

export default ClientListItem;
