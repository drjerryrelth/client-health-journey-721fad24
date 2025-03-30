
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Weight, LineChart, Pill, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  
  // Handle button click with navigate instead of Link for more control
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };
  
  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <header className="bg-gradient-to-r from-primary/90 to-primary px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-white mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Track Client Progress for Better Health Outcomes
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                The all-in-one progress tracking solution for health clinics, med spas, and wellness providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={handleLoginClick}
                >
                  Log In
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                  onClick={(e) => {
                    const element = document.getElementById('features');
                    if (element) {
                      e.preventDefault();
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md transform rotate-2">
                <div className="bg-primary/10 p-3 rounded-md mb-3">
                  <LineChart className="h-6 w-6 text-primary" />
                  <h3 className="font-medium">Client Weight Progress</h3>
                </div>
                <div className="bg-green-50 h-40 rounded-md mb-3"></div>
                <div className="flex justify-between">
                  <div className="bg-gray-100 w-20 h-6 rounded"></div>
                  <div className="bg-primary/20 w-20 h-6 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features section */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Features content - kept the same */}
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
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Weight className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-gray-800">Client Health Tracker</span>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Client Health Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
