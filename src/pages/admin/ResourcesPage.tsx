
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Video, BookOpen } from 'lucide-react';

const ResourcesPage = () => {
  // Placeholder data for resource categories
  const resourceCategories = [
    {
      id: 1,
      title: 'Training Videos',
      description: 'Educational videos for clinics and coaches',
      icon: <Video size={20} className="text-blue-500" />
    },
    {
      id: 2,
      title: 'Documents & Forms',
      description: 'Downloadable templates and forms',
      icon: <FileText size={20} className="text-green-500" />
    },
    {
      id: 3,
      title: 'Tutorials & Guides',
      description: 'Step-by-step instructions and best practices',
      icon: <BookOpen size={20} className="text-amber-500" />
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-500">Training materials and resources for clinics and coaches</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {resourceCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-md font-medium">{category.title}</CardTitle>
              {category.icon}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{category.description}</p>
              <div className="mt-4 text-sm text-primary-500">Coming soon</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            This section will contain training materials, guides, and resources for clinics and coaches.
            Upload videos, documents, and other training content to help your network succeed.
            Content management features coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesPage;
