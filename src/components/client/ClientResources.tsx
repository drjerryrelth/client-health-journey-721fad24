
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Temporary mock data
const initialResources = [
  {
    id: '1',
    title: 'Getting Started Guide',
    description: 'A comprehensive guide to help you get started with your wellness journey',
    fileType: 'pdf',
    category: 'guides',
    url: '#',
    isNew: true,
    uploadDate: '2023-09-05T15:30:00Z'
  },
  {
    id: '2',
    title: 'Meal Prep Strategies',
    description: 'Easy strategies to prepare healthy meals in advance',
    fileType: 'pdf',
    category: 'nutrition',
    url: '#',
    isNew: false,
    uploadDate: '2023-08-15T09:45:00Z'
  },
  {
    id: '3',
    title: 'Supplement Schedule',
    description: 'A detailed schedule for taking your supplements for optimal results',
    fileType: 'pdf',
    category: 'protocols',
    url: '#',
    isNew: true,
    uploadDate: '2023-09-10T11:20:00Z'
  },
  {
    id: '4',
    title: 'Stress Management Techniques',
    description: 'Effective techniques to manage stress and improve well-being',
    fileType: 'pdf',
    category: 'wellness',
    url: '#',
    isNew: false,
    uploadDate: '2023-07-20T14:15:00Z'
  }
];

const ClientResources = () => {
  const [resources] = useState(initialResources);
  const [selectedResource, setSelectedResource] = useState<typeof initialResources[0] | null>(null);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Resources & Documents
          </CardTitle>
          <CardDescription>
            Documents and resources shared by your coach
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="protocols">Protocols</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource}
                    onClick={() => setSelectedResource(resource)} 
                  />
                ))}
              </div>
            </TabsContent>
            
            {['guides', 'nutrition', 'protocols', 'wellness'].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources
                    .filter((r) => r.category === category)
                    .map((resource) => (
                      <ResourceCard 
                        key={resource.id} 
                        resource={resource}
                        onClick={() => setSelectedResource(resource)} 
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedResource && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedResource.title}</CardTitle>
            <CardDescription>
              Uploaded on {formatDate(selectedResource.uploadDate)}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col items-center justify-center p-10 border rounded-md bg-gray-50">
              <FileText size={64} className="text-gray-400 mb-4" />
              <p className="text-gray-500 mb-6">{selectedResource.description}</p>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye size={16} />
                  Preview
                </Button>
                <Button className="flex items-center gap-2">
                  <Download size={16} />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ResourceCardProps {
  resource: typeof initialResources[0];
  onClick: () => void;
}

const ResourceCard = ({ resource, onClick }: ResourceCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="text-primary h-6 w-6" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{resource.title}</h3>
              {resource.isNew && (
                <Badge variant="secondary" className="h-5 text-xs">New</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {resource.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientResources;
