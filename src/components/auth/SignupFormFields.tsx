
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { signupSchema, SignupFormValues } from './signup-schema';
import { Link } from 'react-router-dom';

interface SignupFormFieldsProps {
  onSubmit: (data: SignupFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const SignupFormFields = ({ onSubmit, isSubmitting }: SignupFormFieldsProps) => {
  // Initialize form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      clinicName: '',
      primaryContact: '',
      hipaaAcknowledgment: false,
      legalAcknowledgment: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
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
        
        <FormField
          control={form.control}
          name="clinicName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your clinic name" 
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
              <FormLabel>Primary Contact</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Full name" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="text-sm text-gray-500 mt-2">
          By registering, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms</Link> and{' '}
          <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
              Signing Up...
            </span>
          ) : (
            'Register Now'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupFormFields;
