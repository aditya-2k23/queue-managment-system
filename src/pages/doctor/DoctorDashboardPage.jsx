import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DoctorDashboard } from "@/components/DoctorDashboard";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DoctorDashboardPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { doctorData, userRole, isLoading, signOut, isAuthenticated, isDoctor } = useAuth();
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Debug logging
    console.log('DoctorDashboard - Auth State:', {
      isLoading,
      isAuthenticated,
      userRole,
      isDoctor,
      doctorData,
      doctorId
    });

    // Only check after initial loading is complete
    if (!isLoading) {
      setIsInitialized(true);
      
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        console.log('Not authenticated, redirecting to login');
        navigate("/doctor/login");
      } else if (userRole && userRole !== 'doctor') {
        // Authenticated but not a doctor
        console.log('Not a doctor, showing error');
        setError("You are not authorized to access this page. Please log in with a doctor account.");
      } else if (isDoctor && doctorData && doctorData.id) {
        // If doctor is authenticated and we have doctor data
        if (doctorId && doctorData.id !== doctorId) {
          // Doctor trying to access another doctor's dashboard
          console.log('Wrong doctor ID, redirecting');
          navigate(`/doctor/dashboard/${doctorData.id}`);
        } else if (!doctorId) {
          // No doctorId in URL, redirect to doctor's own dashboard
          console.log('No doctor ID in URL, redirecting');
          navigate(`/doctor/dashboard/${doctorData.id}`);
        }
        // Clear any existing errors when successfully authenticated
        setError(null);
      }
    }
  }, [isLoading, isAuthenticated, userRole, isDoctor, doctorId, doctorData, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/doctor/login");
  };

  // Loading state - show loading only during initial load
  if (isLoading || (!isInitialized && !doctorData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state - not authorized
  if (error && isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button 
              onClick={() => navigate("/doctor/login")}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Go to Doctor Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // After initialization, check if we should redirect
  if (isInitialized && (!isAuthenticated || !isDoctor)) {
    // Will redirect via useEffect, show loading in the meantime
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Check if we have the required doctor data
  if (!doctorData || !doctorData.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  // Main dashboard render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar with sign out */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Logged in as:</span>
              <span className="font-medium text-gray-900">{doctorData.email}</span>
              <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium">
                Doctor
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Doctor Dashboard Component */}
      <DoctorDashboard 
        doctorId={doctorData.id} 
        doctorData={doctorData} 
      />
    </div>
  );
}