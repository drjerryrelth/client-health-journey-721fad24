
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ColorPreview from './ColorPreview';

interface ColorCustomizationTabProps {
  primaryColor: string | null;
  secondaryColor: string | null;
  onColorUpdate: (colorType: 'primary_color' | 'secondary_color', color: string) => void;
}

const ColorCustomizationTab = ({ 
  primaryColor, 
  secondaryColor, 
  onColorUpdate 
}: ColorCustomizationTabProps) => {
  const primaryColorValue = primaryColor || '#1eaedb';
  const secondaryColorValue = secondaryColor || '#22bc6c';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex items-center gap-4 mt-1.5">
            <div 
              className="w-8 h-8 rounded-md border"
              style={{ backgroundColor: primaryColorValue }}
            />
            <Input 
              id="primaryColor"
              type="text" 
              value={primaryColorValue} 
              onChange={(e) => onColorUpdate('primary_color', e.target.value)}
              placeholder="#1eaedb"
            />
            <Input 
              type="color" 
              value={primaryColorValue}
              onChange={(e) => onColorUpdate('primary_color', e.target.value)}
              className="w-12 h-10 p-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="secondaryColor">Secondary Color</Label>
          <div className="flex items-center gap-4 mt-1.5">
            <div 
              className="w-8 h-8 rounded-md border"
              style={{ backgroundColor: secondaryColorValue }}
            />
            <Input 
              id="secondaryColor"
              type="text" 
              value={secondaryColorValue} 
              onChange={(e) => onColorUpdate('secondary_color', e.target.value)}
              placeholder="#22bc6c"
            />
            <Input 
              type="color" 
              value={secondaryColorValue}
              onChange={(e) => onColorUpdate('secondary_color', e.target.value)}
              className="w-12 h-10 p-1"
            />
          </div>
        </div>
        
        <ColorPreview 
          primaryColor={primaryColorValue} 
          secondaryColor={secondaryColorValue} 
        />
      </div>
    </div>
  );
};

export default ColorCustomizationTab;
