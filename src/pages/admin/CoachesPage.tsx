
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CoachService } from '@/services/coaches';
import ClinicService from '@/services/clinic-service'; // Correct import
import { toast } from 'sonner';
import ErrorDialog from '@/components/coaches/ErrorDialog';

const CoachesPage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [coaches, setCoaches] = useState([]);
  const [clinics, setClinics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchClinics = async () => {
    try {
      const allClinics = await ClinicService.getClinics();
      // Create a map of clinic IDs to clinic names for easy lookup
      const clinicMap = {};
      allClinics.forEach(clinic => {
        clinicMap[clinic.id] = clinic.name;
      });
      setClinics(clinicMap);
      console.log('[CoachesPage] Clinic map created:', clinicMap);
    } catch (err) {
      console.error('[CoachesPage] Error fetching clinics:', err);
    }
  };

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`[CoachesPage] Fetching all coaches (attempt: ${retryCount + 1})`);
      
      // Use the admin-specific coach service function to avoid RLS issues
      const allCoaches = await CoachService.getAllCoachesForAdmin();
      
      console.log('[CoachesPage] Received coaches data:', allCoaches);
      console.log('[CoachesPage] Coaches data type:', typeof allCoaches);
      console.log('[CoachesPage] Is array?', Array.isArray(allCoaches));
      
      if (!Array.isArray(allCoaches)) {
        console.error('[CoachesPage] Invalid coaches data format:', allCoaches);
        throw new Error('Invalid data format received from service');
      }
      
      setCoaches(allCoaches);
      
      if (allCoaches.length === 0) {
        console.warn('[CoachesPage] No coaches were returned');
        toast.info('No coaches found in the database');
      } else {
        toast.success(`Successfully loaded ${allCoaches.length} coaches`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("[CoachesPage] Error fetching coaches:", err);
      setError("Failed to load coaches. Please try again.");
      setErrorDetails(err instanceof Error ? err.message : String(err));
      setLoading(false);
      
      // If this was the first attempt, retry once automatically
      if (retryCount === 0) {
        console.log('[CoachesPage] First attempt failed, retrying automatically');
        setRetryCount(1);
        setTimeout(() => {
          fetchCoaches();
        }, 1000);
      }
    }
  };

  useEffect(() => {
    console.log('[CoachesPage] Component mounted, fetching coaches');
    fetchClinics(); // First fetch clinics
    fetchCoaches(); // Then fetch coaches
  }, []);

  const handleBackToClinics = () => {
    navigate("/clinics");
  };

  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
    toast.info("Refreshing coaches data...");
    fetchClinics(); // Refresh clinics data too
    fetchCoaches();
  };

  const handleShowError = () => {
    setErrorDialogOpen(true);
  };

  const getClinicName = (clinicId) => {
    return clinics[clinicId] || `Unknown Clinic (${clinicId ? clinicId.slice(-4) : 'None'})`;
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
          <CardTitle className="flex items-center justify-between">
            <span>Coaches</span>
            {coaches.length > 0 && <Badge variant="outline" className="ml-2 bg-primary-50 text-primary-700">{coaches.length} Total</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading coaches...</p>
                <p className="text-xs text-gray-400 mt-1">{retryCount > 0 ? `Attempt ${retryCount + 1}` : ''}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
                <p className="text-red-500 font-medium mb-2">{error}</p>
                <div className="flex gap-2 justify-center mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw size={14} />
                    <span>Try Again</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShowError}
                    className="flex items-center gap-1"
                  >
                    <AlertCircle size={14} />
                    <span>Show Details</span>
                  </Button>
                </div>
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
                            <span>{getClinicName(coach.clinicId)}</span>
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
                        No coaches found in the system. Please add coaches to clinics to see them here.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        errorDetails={errorDetails}
        title="Coach Fetching Error"
      />
    </div>
  );
};

export default CoachesPage;
