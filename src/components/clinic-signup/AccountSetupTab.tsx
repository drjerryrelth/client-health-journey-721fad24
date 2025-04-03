
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ClinicSignupFormValues } from './types';
import HipaaNotice from './HipaaNotice';
import { Link } from 'react-router-dom';

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
  return (
    <div className="space-y-4">
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
      
      {createAccount && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
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
