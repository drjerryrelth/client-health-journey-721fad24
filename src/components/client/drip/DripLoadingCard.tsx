
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const DripLoadingCard: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardContent className="py-6 text-center">
        <p className="text-gray-500">Loading today's message...</p>
      </CardContent>
    </Card>
  );
};

export default DripLoadingCard;
