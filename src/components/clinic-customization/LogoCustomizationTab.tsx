
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

interface LogoCustomizationTabProps {
  logo: string | null;
  clinicName: string;
  onLogoUpload: (file: File) => void;
}

const LogoCustomizationTab = ({ 
  logo, 
  clinicName, 
  onLogoUpload 
}: LogoCustomizationTabProps) => {
  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onLogoUpload(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {logo ? (
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
              <img 
                src={logo} 
                alt={`${clinicName} logo`} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleFileSelect}
            >
              Replace Logo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-gray-400" />
            </div>
            <Button
              variant="outline"
              onClick={handleFileSelect}
            >
              Upload Logo
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 200x200px, PNG or SVG preferred
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Logo upload is shown as a mock UI in this demo. 
          In a production environment, you would implement Supabase Storage for actual file uploads.
        </p>
      </div>
    </div>
  );
};

export default LogoCustomizationTab;
