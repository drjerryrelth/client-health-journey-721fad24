
import React, { useState } from 'react';
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

const CoachesPage = () => {
  const navigate = useNavigate();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  
  const {
    coaches,
    loading,
    error,
    errorDetails,
    refresh,
    retryCount
  } = useAdminCoaches();

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  const handleShowError = () => {
    setErrorDialogOpen(true);
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
            {coaches.length > 0 && <Badge variant="outline" className="ml-2 bg-primary-50 text-primary-700">{coaches.length} Total</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <CoachesLoadingState retryCount={retryCount} />
          ) : error ? (
            <CoachesErrorState 
              error={error}
              onRefresh={refresh}
              onShowDetails={handleShowError}
            />
          ) : (
            <CoachesTable coaches={coaches} />
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
