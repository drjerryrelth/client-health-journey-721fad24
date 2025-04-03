
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { SignupFormValues } from '../signup-schema';

interface SignupFormBasicFieldsProps {
  form: UseFormReturn<SignupFormValues>;
}

const SignupFormBasicFields = ({ form }: SignupFormBasicFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="clinicName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clinic Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your clinic name" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="primaryContact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Contact Person</FormLabel>
            <FormControl>
              <Input 
                placeholder="Full name of primary contact" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                placeholder="you@example.com" 
                type="email"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...field} 
              />
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
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SignupFormBasicFields;
