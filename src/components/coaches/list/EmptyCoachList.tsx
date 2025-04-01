
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyCoachListProps {
  colSpan: number;
}

const EmptyCoachList: React.FC<EmptyCoachListProps> = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-4">
        No coaches found for this clinic
      </TableCell>
    </TableRow>
  );
};

export default EmptyCoachList;
