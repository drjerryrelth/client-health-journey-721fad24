
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { SignupFormValues } from '../signup-schema';

interface SignupHipaaSectionProps {
  form: UseFormReturn<SignupFormValues>;
}

const SignupHipaaSection = ({ form }: SignupHipaaSectionProps) => {
  return (
    <>
      <Alert variant="destructive" className="border-amber-500 text-amber-800 bg-amber-50 mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="font-medium">HIPAA Compliance Notice</AlertTitle>
        <AlertDescription className="text-sm">
          This application is designed for general health tracking and is NOT HIPAA compliant. 
          While we take security and privacy seriously, this platform should not be used to 
          store or transmit protected health information (PHI) as defined by HIPAA regulations. 
          If you require HIPAA compliance for your practice, please seek alternative solutions.
        </AlertDescription>
      </Alert>

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
    </>
  );
};

export default SignupHipaaSection;
