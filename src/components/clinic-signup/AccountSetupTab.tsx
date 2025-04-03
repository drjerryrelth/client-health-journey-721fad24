
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ClinicSignupFormValues, planOptions, addOnOptions } from './types';
import HipaaNotice from './HipaaNotice';
import { Link } from 'react-router-dom';
import { RadioGroup } from '@/components/ui/radio-group';
import PlanOption from './PlanOption';

interface AccountSetupTabProps {
  form: UseFormReturn<ClinicSignupFormValues>;
  createAccount: boolean;
  onToggleCreateAccount: (checked: boolean) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const AccountSetupTab = ({ 
  form, 
  createAccount, 
  onToggleCreateAccount, 
  onBack, 
  isSubmitting 
}: AccountSetupTabProps) => {
  // Pre-fill admin email with clinic email when component mounts or createAccount changes
  useEffect(() => {
    if (createAccount && form.getValues('email') === '') {
      const clinicEmail = form.getValues('clinicEmail');
      form.setValue('email', clinicEmail);
    }
  }, [createAccount, form]);

  const selectedPlan = form.watch('selectedPlan');
  const addOns = form.watch('addOns') || [];

  // Filter add-ons based on selected plan
  const availableAddOns = addOnOptions.filter(
    addon => addon.availableFor.includes(selectedPlan)
  );

  // Handle add-on toggle
  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    const currentAddOns = form.getValues('addOns') || [];
    let updatedAddOns = [...currentAddOns];
    
    if (checked) {
      updatedAddOns.push(addOnId);
    } else {
      updatedAddOns = updatedAddOns.filter(id => id !== addOnId);
    }
    
    form.setValue('addOns', updatedAddOns);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Checkbox 
          id="create-account" 
          checked={createAccount} 
          onCheckedChange={(checked) => onToggleCreateAccount(checked === true)} 
          className="mr-2"
        />
        <label htmlFor="create-account" className="text-sm font-medium">
          Create an account for clinic management
        </label>
      </div>
      
      <HipaaNotice />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select a Plan</h3>
        <FormField
          control={form.control}
          name="selectedPlan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3"
                >
                  {planOptions.map((plan) => (
                    <PlanOption
                      key={plan.id}
                      id={plan.id}
                      name={plan.name}
                      description={plan.description}
                      price={plan.price}
                      features={plan.features}
                      selected={field.value === plan.id}
                      onSelect={() => field.onChange(plan.id)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {availableAddOns.length > 0 && (
        <div className="space-y-4 mt-6 border-t pt-6">
          <h3 className="text-lg font-medium">Optional Add-ons</h3>
          <div className="space-y-3">
            {availableAddOns.map((addon) => (
              <div 
                key={addon.id} 
                className="border rounded-lg p-4 bg-background hover:bg-background/80"
              >
                <div className="flex items-start">
                  <Checkbox 
                    id={`addon-${addon.id}`}
                    checked={addOns.includes(addon.id)}
                    onCheckedChange={(checked) => handleAddOnToggle(addon.id, checked === true)}
                    className="mt-1 mr-2"
                  />
                  <div>
                    <label 
                      htmlFor={`addon-${addon.id}`}
                      className="text-lg font-medium cursor-pointer"
                    >
                      {addon.name}
                    </label>
                    <p className="text-sm text-muted-foreground">{addon.description}</p>
                    <div className="text-sm font-semibold text-primary mt-1">{addon.price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {createAccount && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email <span className="text-red-500">*</span></FormLabel>
                <FormDescription>
                  Email for the administrator account (pre-filled with clinic email)
                </FormDescription>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="hipaaAcknowledgment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I acknowledge that this application is not HIPAA compliant and should not be used for protected health information.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legalAcknowledgment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      )}
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Clinic...' : 'Complete Signup'}
        </Button>
      </div>
    </div>
  );
};

export default AccountSetupTab;
