
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, CreditCard } from 'lucide-react';
import { Clinic } from '@/services/clinic-service';

interface ClinicDetailsTabProps {
  clinic: Clinic;
  onEditClick: () => void;
}

const ClinicDetailsTab = ({ clinic, onEditClick }: ClinicDetailsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>General Information</CardTitle>
          <Button variant="outline" onClick={onEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-base">
                {clinic.streetAddress && `${clinic.streetAddress}`}
                {clinic.city && clinic.state && <span><br />{clinic.city}, {clinic.state} {clinic.zip}</span>}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p className="text-base">
                {clinic.primaryContact && <span>{clinic.primaryContact}<br /></span>}
                {clinic.email && <span>{clinic.email}<br /></span>}
                {clinic.phone && <span>{clinic.phone}</span>}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Billing Information
          </CardTitle>
          <Button variant="outline" onClick={onEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Billing
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Billing Contact</p>
              <p className="text-base">
                {clinic.billingContactName ? (
                  <>
                    {clinic.billingContactName}<br />
                    {clinic.billingEmail && <span>{clinic.billingEmail}<br /></span>}
                    {clinic.billingPhone && <span>{clinic.billingPhone}</span>}
                  </>
                ) : (
                  <span className="text-muted-foreground">No billing contact set</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Billing Address</p>
              <p className="text-base">
                {clinic.billingAddress ? (
                  <>
                    {clinic.billingAddress}<br />
                    {clinic.billingCity && clinic.billingState && (
                      <span>{clinic.billingCity}, {clinic.billingState} {clinic.billingZip}</span>
                    )}
                  </>
                ) : (
                  <span className="text-muted-foreground">No billing address set</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
              <p className="text-base">
                {clinic.paymentMethod || <span className="text-muted-foreground">Not set</span>}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subscription</p>
              <div className="flex items-center">
                {clinic.subscriptionTier && (
                  <span className="mr-2">{clinic.subscriptionTier}</span>
                )}
                {clinic.subscriptionStatus && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    clinic.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                    clinic.subscriptionStatus === 'trial' ? 'bg-blue-100 text-blue-800' :
                    clinic.subscriptionStatus === 'past_due' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {clinic.subscriptionStatus.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicDetailsTab;
