
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { signupSchema, SignupFormValues } from '../signup-schema';

import SignupFormBasicFields from './SignupFormBasicFields';
import SignupDemoNotice from './SignupDemoNotice';
import SignupHipaaSection from './SignupHipaaSection';
import SignupLegalSection from './SignupLegalSection';
import SignupHeader from './SignupHeader';

interface SignupFormProps {
  onSubmit: (data: SignupFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const SignupForm = ({ onSubmit, isSubmitting }: SignupFormProps) => {
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
        <SignupHeader />
        
        <SignupDemoNotice />
        
        <div className="space-y-4">
          <SignupFormBasicFields form={form} />
        </div>
        
        <SignupHipaaSection form={form} />
        
        <SignupLegalSection form={form} />
        
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

export default SignupForm;
