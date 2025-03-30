
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ClinicService, { Clinic } from '@/services/clinic-service';

interface EditClinicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId: string;
  onClinicUpdated?: () => void;
}

const EditClinicDialog = ({ open, onOpenChange, clinicId, onClinicUpdated }: EditClinicDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  
  // General info
  const [clinicName, setClinicName] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [clinicEmail, setClinicEmail] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [primaryContact, setPrimaryContact] = useState('');
  const [status, setStatus] = useState('active');
  
  // Billing info
  const [billingContactName, setBillingContactName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [subscriptionTier, setSubscriptionTier] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('active');

  useEffect(() => {
    if (open && clinicId) {
      fetchClinicDetails();
    }
  }, [open, clinicId]);

  const fetchClinicDetails = async () => {
    setIsLoading(true);
    try {
      const fetchedClinic = await ClinicService.getClinic(clinicId);
      if (fetchedClinic) {
        setClinic(fetchedClinic);
        
        // Set general info
        setClinicName(fetchedClinic.name || '');
        setClinicLocation(fetchedClinic.location || '');
        setClinicEmail(fetchedClinic.email || '');
        setClinicPhone(fetchedClinic.phone || '');
        setStreetAddress(fetchedClinic.streetAddress || '');
        setCity(fetchedClinic.city || '');
        setState(fetchedClinic.state || '');
        setZipCode(fetchedClinic.zip || '');
        setPrimaryContact(fetchedClinic.primaryContact || '');
        setStatus(fetchedClinic.status || 'active');
        
        // Set billing info
        setBillingContactName(fetchedClinic.billingContactName || '');
        setBillingEmail(fetchedClinic.billingEmail || '');
        setBillingPhone(fetchedClinic.billingPhone || '');
        setBillingAddress(fetchedClinic.billingAddress || '');
        setBillingCity(fetchedClinic.billingCity || '');
        setBillingState(fetchedClinic.billingState || '');
        setBillingZip(fetchedClinic.billingZip || '');
        setPaymentMethod(fetchedClinic.paymentMethod || '');
        setSubscriptionTier(fetchedClinic.subscriptionTier || '');
        setSubscriptionStatus(fetchedClinic.subscriptionStatus || 'active');
      }
    } catch (error) {
      console.error('Error fetching clinic details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch clinic details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!clinicName) {
      toast({
        title: "Missing Information",
        description: "Please provide clinic name.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedClinic = await ClinicService.updateClinic(clinicId, {
        name: clinicName,
        location: clinicLocation,
        email: clinicEmail || null,
        phone: clinicPhone || null,
        status: status as 'active' | 'inactive',
        streetAddress: streetAddress || null,
        city: city || null,
        state: state || null,
        zip: zipCode || null,
        primaryContact: primaryContact || null,
        billingContactName: billingContactName || null,
        billingEmail: billingEmail || null,
        billingPhone: billingPhone || null,
        billingAddress: billingAddress || null,
        billingCity: billingCity || null,
        billingState: billingState || null,
        billingZip: billingZip || null,
        paymentMethod: paymentMethod || null,
        subscriptionTier: subscriptionTier || null,
        subscriptionStatus: subscriptionStatus as 'active' | 'inactive' || null
      });

      if (updatedClinic) {
        toast({
          title: "Clinic Updated",
          description: `${clinicName} has been updated successfully.`
        });
        
        onOpenChange(false);
        if (onClinicUpdated) onClinicUpdated();
      }
    } catch (error) {
      console.error('Error updating clinic:', error);
      toast({
        title: "Error",
        description: "Failed to update clinic.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Clinic</DialogTitle>
          <DialogDescription>
            Update clinic information including billing details.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="billing">Billing Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clinic-name" className="text-right">Name</Label>
                <Input 
                  id="clinic-name" 
                  value={clinicName} 
                  onChange={(e) => setClinicName(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clinic-status" className="text-right">Status</Label>
                <select 
                  id="clinic-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input 
                  id="location" 
                  value={clinicLocation} 
                  onChange={(e) => setClinicLocation(e.target.value)} 
                  className="col-span-3" 
                  placeholder="General location (e.g. Downtown)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="primary-contact" className="text-right">Primary Contact</Label>
                <Input 
                  id="primary-contact" 
                  value={primaryContact} 
                  onChange={(e) => setPrimaryContact(e.target.value)} 
                  className="col-span-3" 
                  placeholder="Main contact person's name"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="street-address" className="text-right">Street Address</Label>
                <Input 
                  id="street-address" 
                  value={streetAddress} 
                  onChange={(e) => setStreetAddress(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">City</Label>
                <Input 
                  id="city" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">State</Label>
                <Input 
                  id="state" 
                  value={state} 
                  onChange={(e) => setState(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zip-code" className="text-right">ZIP Code</Label>
                <Input 
                  id="zip-code" 
                  value={zipCode} 
                  onChange={(e) => setZipCode(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clinic-email" className="text-right">Email</Label>
                <Input 
                  id="clinic-email" 
                  type="email" 
                  value={clinicEmail} 
                  onChange={(e) => setClinicEmail(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clinic-phone" className="text-right">Phone</Label>
                <Input 
                  id="clinic-phone" 
                  type="tel" 
                  value={clinicPhone} 
                  onChange={(e) => setClinicPhone(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billing-contact-name" className="text-right">Billing Contact</Label>
                <Input 
                  id="billing-contact-name" 
                  value={billingContactName} 
                  onChange={(e) => setBillingContactName(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billing-email" className="text-right">Billing Email</Label>
                <Input 
                  id="billing-email" 
                  type="email"
                  value={billingEmail} 
                  onChange={(e) => setBillingEmail(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billing-phone" className="text-right">Billing Phone</Label>
                <Input 
                  id="billing-phone" 
                  type="tel"
                  value={billingPhone} 
                  onChange={(e) => setBillingPhone(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billing-address" className="text-right">Billing Address</Label>
                <Input 
                  id="billing-address" 
                  value={billingAddress} 
                  onChange={(e) => setBillingAddress(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billing-city" className="text-right">Billing City</Label>
                <Input 
                  id="billing-city" 
                  value={billingCity} 
                  onChange={(e) => setBillingCity(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billing-state" className="text-right">Billing State</Label>
                <Input 
                  id="billing-state" 
                  value={billingState} 
                  onChange={(e) => setBillingState(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billing-zip" className="text-right">Billing ZIP</Label>
                <Input 
                  id="billing-zip" 
                  value={billingZip} 
                  onChange={(e) => setBillingZip(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment-method" className="text-right">Payment Method</Label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Select Payment Method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Check">Check</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subscription-tier" className="text-right">Subscription Tier</Label>
                <select
                  id="subscription-tier"
                  value={subscriptionTier}
                  onChange={(e) => setSubscriptionTier(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Select Subscription</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subscription-status" className="text-right">Subscription Status</Label>
                <select
                  id="subscription-status"
                  value={subscriptionStatus}
                  onChange={(e) => setSubscriptionStatus(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="past_due">Past Due</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClinicDialog;
