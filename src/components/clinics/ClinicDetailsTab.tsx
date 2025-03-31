
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clinic } from '@/services/clinic-service';
import { ExternalLink, Palette } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface ClinicDetailsTabProps {
  clinic: Clinic;
  onEditClick: () => void;
}

const ClinicDetailsTab = ({ clinic, onEditClick }: ClinicDetailsTabProps) => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const isAdmin = hasRole('admin') || hasRole('super_admin');

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-base font-medium mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500 block">Email</span>
                  <span>{clinic.email || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Phone</span>
                  <span>{clinic.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Primary Contact</span>
                  <span>{clinic.primary_contact || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Location</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500 block">Address</span>
                  <span>{clinic.street_address || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">City, State ZIP</span>
                  <span>
                    {[
                      clinic.city,
                      clinic.state ? `, ${clinic.state}` : '',
                      clinic.zip ? ` ${clinic.zip}` : '',
                    ]
                      .filter(Boolean)
                      .join('') || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isAdmin && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-base font-medium mb-2">Branding & Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 block">Primary Color</span>
                    <div className="flex items-center mt-1">
                      {clinic.primary_color ? (
                        <div className="flex items-center">
                          <div 
                            className="w-5 h-5 rounded-full mr-2 border"
                            style={{ backgroundColor: clinic.primary_color }}
                          ></div>
                          <span>{clinic.primary_color}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Default</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500 block">Secondary Color</span>
                    <div className="flex items-center mt-1">
                      {clinic.secondary_color ? (
                        <div className="flex items-center">
                          <div 
                            className="w-5 h-5 rounded-full mr-2 border"
                            style={{ backgroundColor: clinic.secondary_color }}
                          ></div>
                          <span>{clinic.secondary_color}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Default</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-sm text-gray-500 block">Logo</span>
                  <div className="mt-1">
                    {clinic.logo ? (
                      <div className="flex items-center">
                        <div className="w-12 h-12 border rounded-md bg-gray-50 flex items-center justify-center overflow-hidden mr-3">
                          <img 
                            src={clinic.logo} 
                            alt={`${clinic.name} logo`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <span className="text-sm text-gray-500">Logo is set</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">No logo uploaded</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => navigate('/admin/clinic-customization')}
                  >
                    <Palette size={16} />
                    <span>Manage Clinic Customization</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onEditClick}>Edit Clinic Details</Button>
      </div>
    </div>
  );
};

export default ClinicDetailsTab;
