
import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { SignupFormValues } from '../signup-schema';

interface SignupLegalSectionProps {
  form: UseFormReturn<SignupFormValues>;
}

const SignupLegalSection = ({ form }: SignupLegalSectionProps) => {
  return (
    <>
      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 mt-4">
        <h4 className="text-sm font-medium mb-2">Legal Agreements</h4>
        <p className="text-xs text-gray-600 mb-4">
          By creating an account, you agree to the following legal terms that govern your use of the Client Health Tracker platform. 
          Please review each document carefully before proceeding.
        </p>
        <div className="text-xs text-gray-700 space-y-1 mb-4">
          <p>• You must be at least 18 years of age to use this service</p>
          <p>• You are responsible for maintaining the confidentiality of your account credentials</p>
          <p>• Any content you submit must not violate applicable laws or regulations</p>
          <p>• We reserve the right to suspend or terminate accounts that violate our policies</p>
          <p>• We collect and process personal data as outlined in our Privacy Policy</p>
        </div>
        <div className="text-xs text-gray-600 mb-2">
          For complete details, please review our{' '}
          <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms and Conditions</Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>.
        </div>
      </div>

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
                I have read and agree to the Terms and Conditions and Privacy Policy.
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default SignupLegalSection;
