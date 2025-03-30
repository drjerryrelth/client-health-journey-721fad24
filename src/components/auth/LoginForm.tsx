
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Weight } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Create form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      console.log('Attempting login with:', data.email);
      await login(data.email, data.password);
      toast({
        title: 'Login successful',
        description: 'Welcome to Client Health Tracker!',
      });
      
      // Navigation will be handled by the auth state listener
    } catch (error) {
      console.error('Login error:', error);
      // Toast notification is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (type: 'admin' | 'coach' | 'client') => {
    setIsSubmitting(true);
    
    try {
      let email = '';
      const password = 'password123'; // Demo password
      let fullName = '';
      let role = type;
      
      // Use valid email formats for demo accounts
      switch (type) {
        case 'admin':
          email = 'admin@clienthealthtracker.com';
          fullName = 'Admin User';
          break;
        case 'coach':
          email = 'coach@clienthealthtracker.com';
          fullName = 'Coach User';
          break;
        case 'client':
          email = 'client@clienthealthtracker.com';
          fullName = 'Client User';
          break;
      }
      
      console.log(`Attempting demo login as ${type} with email: ${email}`);
      
      try {
        // First try to login directly
        await login(email, password);
        console.log('Demo login successful');
      } catch (loginError) {
        console.log('Login failed, attempting to create demo account', loginError);
        
        // If login fails, try to sign up the demo user first
        await signUp(email, password, {
          full_name: fullName,
          role: role
        });
        
        console.log('Demo account created, now logging in');
        
        // Now try logging in again
        await login(email, password);
      }
      
      toast({
        title: 'Demo login successful',
        description: `You're logged in as ${type}!`,
      });
      
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during demo login.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
              <Weight className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800">Client Health Tracker</h1>
            <p className="text-gray-500 text-center mt-1">Log in to your account</p>
          </div>
          
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
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                    Logging in...
                  </span>
                ) : (
                  'Log in'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-8">
            <p className="text-sm text-center text-gray-500 mb-4">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                disabled={isSubmitting}
                className="text-xs"
              >
                Login as Admin
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('coach')}
                disabled={isSubmitting}
                className="text-xs"
              >
                Login as Coach
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('client')}
                disabled={isSubmitting}
                className="text-xs"
              >
                Login as Client
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
