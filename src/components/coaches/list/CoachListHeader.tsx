
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CoachListHeaderProps {
  showActions: boolean;
}

const CoachListHeader: React.FC<CoachListHeaderProps> = ({ showActions }) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Coach</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Clinic</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Clients</TableHead>
        {showActions && <TableHead className="w-[80px]">Actions</TableHead>}
      </TableRow>
    </TableHeader>
  );
};

export default CoachListHeader;
