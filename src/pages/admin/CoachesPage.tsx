
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CoachService, Coach } from '@/services/coaches';
import { toast } from 'sonner';

const CoachesPage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch coaches from all clinics (admin view)
      const allCoachesPromises = [];
      
      // Since we need to get all coaches across clinics, we need to 
      // get all clinic IDs first using the service role (handled by the edge function)
      // This would be implemented in a follow-up feature
      const allCoaches = await CoachService.getAllCoaches();
      
      setCoaches(allCoaches);
    } catch (err) {
      console.error("Error fetching coaches:", err);
      setError("Failed to load coaches. Please try again.");
      toast.error("Failed to load coaches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleBackToClinics = () => {
    navigate("/clinics");
  };

  const handleRefresh = () => {
    fetchCoaches();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={handleBackToClinics}
            className="mr-2 flex items-center gap-1"
          >
            <ArrowLeft size={18} />
            <span>Back to All Clinics</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">All Coaches</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coaches</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading coaches...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <p className="text-red-500">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coaches.length > 0 ? (
                    coaches.map((coach) => (
                      <TableRow key={coach.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium">{coach.name}</div>
                        </TableCell>
                        <TableCell>{coach.email}</TableCell>
                        <TableCell>{coach.phone || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="bg-primary-100 h-6 w-6 rounded-full flex items-center justify-center">
                              <Building className="h-3 w-3 text-primary-700" />
                            </div>
                            <span>Clinic {coach.clinicId.slice(-4)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{coach.clients}</TableCell>
                        <TableCell>
                          <Badge className={coach.status === 'active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} variant="outline">
                            {coach.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No coaches found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachesPage;
