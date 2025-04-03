
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { ClinicSignupFormValues, planOptions, addOnOptions } from './types';
import HipaaNotice from './HipaaNotice';
import { RadioGroup } from '@/components/ui/radio-group';
import PlanOption from './PlanOption';
import AddOnOptions from './AddOnOptions';
import AccountCreationFields from './AccountCreationFields';

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

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    console.log('Selecting plan:', planId);
    
    // Set the selected plan
    form.setValue('selectedPlan', planId, { 
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true 
    });
    
    // Filter add-ons that are compatible with the selected plan
    const currentAddOns = form.getValues('addOns') || [];
    const validAddOns = currentAddOns.filter(addOnId => {
      const addOn = addOnOptions.find(a => a.id === addOnId);
      return addOn && addOn.availableFor.includes(planId);
    });
    
    // Update add-ons if needed
    if (currentAddOns.length !== validAddOns.length) {
      form.setValue('addOns', validAddOns);
    }
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
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handlePlanSelect(value);
                  }}
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
                      selected={selectedPlan === plan.id}
                      onSelect={() => {
                        field.onChange(plan.id);
                        handlePlanSelect(plan.id);
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <AddOnOptions 
        addOns={addOns}
        availableAddOns={availableAddOns}
        onToggleAddOn={handleAddOnToggle}
      />
      
      <AccountCreationFields 
        form={form}
        show={createAccount}
      />
      
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
