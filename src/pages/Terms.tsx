
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
          <p className="mt-2 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing or using the Client Health Tracker platform, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-700">
              Permission is granted to temporarily use the Client Health Tracker platform for personal or professional health tracking purposes, subject to the restrictions outlined in these Terms and Conditions.
            </p>
            <ul className="list-disc pl-8 mt-4 text-gray-700">
              <li>The content of the Client Health Tracker pages is for your general information and use only.</li>
              <li>You must not use our platform for any illegal or unauthorized purpose.</li>
              <li>You must not attempt to copy, modify, reverse engineer, or create derivative works from the software.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-gray-700">
              The materials on Client Health Tracker's platform are provided on an 'as is' basis. Client Health Tracker makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">4. Limitations</h2>
            <p className="text-gray-700">
              In no event shall Client Health Tracker or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Client Health Tracker's platform, even if Client Health Tracker or a Client Health Tracker authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">5. Revisions and Errata</h2>
            <p className="text-gray-700">
              The materials appearing on Client Health Tracker's platform could include technical, typographical, or photographic errors. Client Health Tracker does not warrant that any of the materials on its platform are accurate, complete or current. Client Health Tracker may make changes to the materials contained on its platform at any time without notice.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">6. Governing Law</h2>
            <p className="text-gray-700">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
