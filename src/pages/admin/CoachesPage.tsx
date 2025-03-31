
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { useAdminCoaches } from '@/hooks/queries/use-admin-coaches';
import CoachesTable from '@/components/admin/coaches/CoachesTable';
import CoachesLoadingState from '@/components/admin/coaches/CoachesLoadingState';
import CoachesErrorState from '@/components/admin/coaches/CoachesErrorState';
import ErrorDialog from '@/components/coaches/ErrorDialog';
import CoachesFilter from '@/components/admin/coaches/CoachesFilter';

const CoachesPage = () => {
  const navigate = useNavigate();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    clinic: 'all'
  });
  
  const {
    coaches,
    loading,
    error,
    errorDetails,
    refresh,
    retryCount
  } = useAdminCoaches();

  // Extract unique clinics for filtering
  const clinics = useMemo(() => {
    if (!coaches || coaches.length === 0) return {};
    
    const clinicMap: Record<string, string> = {};
    coaches.forEach(coach => {
      if (coach.clinicId && coach.clinicName) {
        clinicMap[coach.clinicId] = coach.clinicName;
      }
    });
    return clinicMap;
  }, [coaches]);

  // Filter coaches based on search, status, and clinic
  const filteredCoaches = useMemo(() => {
    if (!coaches) return [];
    
    return coaches.filter(coach => {
      // Search filter
      const searchMatch = filters.search === '' || 
        coach.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        coach.email.toLowerCase().includes(filters.search.toLowerCase());
      
      // Status filter
      const statusMatch = filters.status === 'all' || coach.status === filters.status;
      
      // Clinic filter
      const clinicMatch = filters.clinic === 'all' || coach.clinicId === filters.clinic;
      
      return searchMatch && statusMatch && clinicMatch;
    });
  }, [coaches, filters]);

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  const handleShowError = () => {
    setErrorDialogOpen(true);
  };

  const handleFilterChange = (newFilters: { search: string; status: string; clinic: string }) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard}
            className="mr-2 flex items-center gap-1"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">All Coaches</h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refresh}
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
            {filteredCoaches.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-primary-50 text-primary-700">
                {filteredCoaches.length} of {coaches.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add the filter component */}
          {!loading && !error && coaches.length > 0 && (
            <CoachesFilter 
              onFilterChange={handleFilterChange} 
              clinics={clinics} 
            />
          )}
          
          {loading ? (
            <CoachesLoadingState retryCount={retryCount} />
          ) : error ? (
            <CoachesErrorState 
              error={error}
              onRefresh={refresh}
              onShowDetails={handleShowError}
            />
          ) : (
            <CoachesTable coaches={filteredCoaches} />
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
