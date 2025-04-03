
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/login" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700">
              Your privacy is important to us. It is Client Health Tracker's policy to respect your privacy regarding any information we may collect from you across our platform.
            </p>
            <p className="text-gray-700 mt-4">
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-gray-700">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-8 mt-4 text-gray-700">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details.</li>
              <li><strong>Health-Related Information:</strong> Weight, measurements, wellness metrics, and other health data you choose to input.</li>
              <li><strong>Usage Information:</strong> How you use our platform, including pages visited, features used, and interactions.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700">
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-8 mt-4 text-gray-700">
              <li>Provide, operate, and maintain our platform</li>
              <li>Improve, personalize, and expand our platform</li>
              <li>Understand and analyze how you use our platform</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you for customer service, updates, and marketing purposes</li>
              <li>Process your transactions</li>
              <li>Find and prevent fraud</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">4. HIPAA Disclaimer</h2>
            <p className="text-gray-700">
              Please note that Client Health Tracker is NOT HIPAA compliant. This platform should not be used to store or transmit protected health information (PHI) as defined by HIPAA regulations.
            </p>
            <p className="text-gray-700 mt-4">
              While we take security and privacy seriously, our platform is intended for general health and wellness tracking only. If you require HIPAA compliance for your practice, please seek alternative solutions.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">5. Data Protection</h2>
            <p className="text-gray-700">
              We securely store your personal information and health data using industry-standard encryption and security measures. We retain your information only as long as necessary to provide you with our services and as required by law.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-gray-700">
              You have the right to access the personal information we collect from you, change that information, or delete it. To exercise this right, please contact our support team.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">7. Cookies</h2>
            <p className="text-gray-700">
              We use cookies to improve your experience on our platform. These are small pieces of data stored on your device that help us remember your preferences and optimize site functionality.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about our Privacy Policy, please contact us at privacy@clienthealthtracker.example.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
