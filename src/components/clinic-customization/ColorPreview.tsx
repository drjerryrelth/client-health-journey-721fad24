
import React from 'react';
import { Button } from '@/components/ui/button';

interface ColorPreviewProps {
  primaryColor: string;
  secondaryColor: string;
}

const ColorPreview = ({ primaryColor, secondaryColor }: ColorPreviewProps) => {
  return (
    <div className="mt-8">
      <h3 className="font-medium mb-3">Preview</h3>
      <div className="border rounded-md p-6 space-y-4">
        <div className="flex gap-4">
          <Button style={{ backgroundColor: primaryColor }}>
            Primary Button
          </Button>
          <Button 
            variant="outline" 
            style={{ 
              borderColor: primaryColor,
              color: primaryColor
            }}
          >
            Outline Button
          </Button>
        </div>
        <div className="flex gap-4">
          <Button style={{ backgroundColor: secondaryColor }}>
            Secondary Button
          </Button>
          <Button 
            variant="outline" 
            style={{ 
              borderColor: secondaryColor,
              color: secondaryColor
            }}
          >
            Outline Button
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ColorPreview;
