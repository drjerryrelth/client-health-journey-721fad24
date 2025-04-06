
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Check, Upload } from 'lucide-react';

interface Clinic {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface ClinicCustomizationCardProps {
  selectedClinic: Clinic | null;
  onColorUpdate: (type: 'primary' | 'secondary', color: string) => void;
  onLogoUpload: (logoUrl: string) => void;
}

export const ClinicCustomizationCard: React.FC<ClinicCustomizationCardProps> = ({
  selectedClinic,
  onColorUpdate,
  onLogoUpload
}) => {
  const [primaryColor, setPrimaryColor] = useState(selectedClinic?.primaryColor || '#4f46e5');
  const [secondaryColor, setSecondaryColor] = useState(selectedClinic?.secondaryColor || '#10b981');
  const [logoPreview, setLogoPreview] = useState<string | null>(selectedClinic?.logo || null);
  
  // Theme presets
  const colorPresets = [
    { name: 'Blue/Green', primary: '#4f46e5', secondary: '#10b981' },
    { name: 'Purple/Orange', primary: '#7c3aed', secondary: '#f59e0b' },
    { name: 'Teal/Lime', primary: '#0891b2', secondary: '#84cc16' },
    { name: 'Red/Blue', primary: '#dc2626', secondary: '#2563eb' },
  ];
  
  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };
  
  const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondaryColor(e.target.value);
  };
  
  const handleApplyColors = () => {
    if (!selectedClinic) return;
    
    onColorUpdate('primary', primaryColor);
    onColorUpdate('secondary', secondaryColor);
  };
  
  const handlePresetSelection = (preset: { primary: string, secondary: string }) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    
    // Auto-apply the preset
    if (selectedClinic) {
      onColorUpdate('primary', preset.primary);
      onColorUpdate('secondary', preset.secondary);
    }
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    
    // Demo: in a real app, this would upload to a server
    // For now, we'll just use the preview URL
    setTimeout(() => {
      onLogoUpload(previewUrl);
    }, 1000);
  };
  
  if (!selectedClinic) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Select a clinic to customize</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize {selectedClinic.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div>
          <Label className="text-base font-medium">Clinic Logo</Label>
          <div className="mt-2 flex items-center gap-4">
            <div 
              className="h-24 w-24 border rounded flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: '#f9fafb' }}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
              ) : (
                <span className="text-gray-400 text-sm">No logo</span>
              )}
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                id="logo-upload"
                className="hidden"
                onChange={handleLogoChange}
              />
              <Label htmlFor="logo-upload" asChild>
                <Button variant="outline" className="gap-2">
                  <Upload size={16} />
                  Upload Logo
                </Button>
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 200x200px, PNG or SVG format
              </p>
            </div>
          </div>
        </div>
        
        {/* Color Theme */}
        <div>
          <Label className="text-base font-medium">Color Theme</Label>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex mt-1">
                <Input 
                  type="color" 
                  id="primary-color" 
                  value={primaryColor} 
                  onChange={handlePrimaryColorChange}
                  className="w-12 h-9 p-1 mr-2"
                />
                <Input 
                  type="text" 
                  value={primaryColor} 
                  onChange={handlePrimaryColorChange}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex mt-1">
                <Input 
                  type="color" 
                  id="secondary-color" 
                  value={secondaryColor} 
                  onChange={handleSecondaryColorChange}
                  className="w-12 h-9 p-1 mr-2"
                />
                <Input 
                  type="text" 
                  value={secondaryColor} 
                  onChange={handleSecondaryColorChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleApplyColors}
            className="mt-2"
          >
            Apply Colors
          </Button>
        </div>
        
        {/* Color Presets */}
        <div>
          <Label className="text-base font-medium">Color Presets</Label>
          <RadioGroup className="mt-2 grid grid-cols-2 gap-2">
            {colorPresets.map((preset, index) => (
              <div 
                key={index}
                className="flex items-center border rounded p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handlePresetSelection(preset)}
              >
                <RadioGroupItem value={`preset-${index}`} id={`preset-${index}`} />
                <div className="ml-2">
                  <Label htmlFor={`preset-${index}`} className="font-normal">
                    {preset.name}
                  </Label>
                  <div className="flex gap-1 mt-1">
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Preview */}
        <div>
          <Label className="text-base font-medium">Preview</Label>
          <div className="mt-2 border rounded p-4" style={{ backgroundColor: '#f9fafb' }}>
            <div className="space-y-2">
              <div 
                className="h-10 rounded flex items-center px-3 text-white font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                Primary Button
              </div>
              <div 
                className="h-10 rounded flex items-center px-3 text-white font-medium"
                style={{ backgroundColor: secondaryColor }}
              >
                Secondary Button
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="h-6 w-6 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Check size={12} />
                </div>
                <span>Primary Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="h-6 w-6 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: secondaryColor }}
                >
                  <Check size={12} />
                </div>
                <span>Secondary Accent</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
