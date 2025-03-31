
import React from 'react';
import ClientDataProvider from '@/components/client/ClientDataProvider';
import ProgramDetailsContent from '@/components/programs/ProgramDetailsContent';

const ClientProgramDetails = () => {
  return (
    <ClientDataProvider>
      <ProgramDetailsContent />
    </ClientDataProvider>
  );
};

export default ClientProgramDetails;
