
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Weight } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome to Client Health Tracker!',
      });
      
      // Redirect based on role
      if (email === 'client@example.com') {
        navigate('/client-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (type: 'admin' | 'client') => {
    setIsSubmitting(true);
    try {
      if (type === 'admin') {
        await login('admin@example.com', 'password123');
        navigate('/dashboard');
      } else {
        await login('client@example.com', 'password123');
        navigate('/client-dashboard');
      }
      toast({
        title: 'Demo login successful',
        description: `You're logged in as ${type === 'admin' ? 'an admin' : 'a client'}!`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An error occurred during demo login',
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
            <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center mb-4">
              <Weight className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800">Client Health Tracker</h1>
            <p className="text-gray-500 text-center mt-1">Log in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
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
          
          <div className="mt-8">
            <p className="text-sm text-center text-gray-500 mb-4">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('admin')}
                disabled={isSubmitting}
                className="text-xs"
              >
                Login as Clinic Staff
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
