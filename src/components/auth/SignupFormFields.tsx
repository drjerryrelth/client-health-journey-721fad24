
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Building } from 'lucide-react';
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
      hipaaAcknowledgment: false as unknown as true, // Type assertion to fix the TypeScript error
      legalAcknowledgment: false as unknown as true, // Type assertion to fix the TypeScript error
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Building size={20} className="text-primary" />
          <h3 className="text-lg font-medium">Clinic Registration</h3>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Demo Mode:</span> To create a demo clinic without email verification, 
            use an email ending with <code>.demo@example.com</code> (e.g., myclinic.demo@example.com)
          </p>
        </div>
        
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
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
              Creating Clinic Account...
            </span>
          ) : (
            'Register Clinic'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupFormFields;
