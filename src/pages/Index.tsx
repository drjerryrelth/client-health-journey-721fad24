import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DemoLoginButtons from '@/components/auth/DemoLoginButtons';
import { Weight, Pill, CheckCircle, LineChart, ArrowRight, Building } from 'lucide-react';
import { useAuth } from '@/context/auth';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  React.useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is already authenticated, redirecting to dashboard');
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'coach') {
        navigate('/coach/dashboard', { replace: true });
      } else if (user.role === 'client') {
        navigate('/client/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleGetStartedClick = () => {
    navigate('/signup/clinic');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-50 to-secondary-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:py-28 lg:max-w-2xl lg:w-full">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Wellness and Nutrition</span>
                <span className="block text-primary-500">Tracking Platform</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                A comprehensive platform for healthcare providers, coaches, 
                and clients to track progress, manage wellness programs, and achieve health goals.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-x-3">
                <Button 
                  onClick={handleLogin} 
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Sign In
                </Button>
                <Button 
                  asChild variant="secondary"
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium text-gray-100 bg-gray-100 hover:bg-gray-200 border-gray-300 hover:text-gray-900"
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>
              <div className="mt-3">
                <Button 
                  asChild
                  variant="link"
                  className="text-primary font-medium flex items-center"
                >
                  <Link to="/signup/clinic">
                    <Building size={16} className="mr-1" />
                    Register your clinic
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Health tracking"
          />
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Weight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track weight, measurements, energy levels, and more with visual charts.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Supplement Management</h3>
              <p className="text-gray-600">
                Assign supplements and track adherence for optimal results.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Check-ins</h3>
              <p className="text-gray-600">
                Simple check-in forms for clients to consistently track their journey.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Reports</h3>
              <p className="text-gray-600">
                Generate comprehensive reports to visualize client progress over time.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="gap-2" onClick={handleGetStartedClick}>
              Register Your Clinic <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Demo Login Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Try Our Demo
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Experience the platform with our demo accounts. No sign-up required.
            </p>
          </div>
          <div className="mt-10">
            <DemoLoginButtons />
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Own a wellness clinic or private practice?</p>
            <Button asChild variant="outline">
              <Link to="/signup/clinic">Register your clinic</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <div className="flex items-center mb-4 md:mb-0">
            <Weight className="h-6 w-6 text-primary-400 mr-2" />
            <span className="font-bold text-white">Client Health Tracker™</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Client Health Tracker™. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
