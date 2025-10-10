import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DoctorDashboard } from "@/components/DoctorDashboard";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DoctorDashboardPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { doctorData, userRole, isLoading, isAuthenticated, isDoctor } =
    useAuth();
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Debug logging
    console.log("DoctorDashboard - Auth State:", {
      isLoading,
      isAuthenticated,
      userRole,
      isDoctor,
      doctorData,
      doctorId,
    });

    // Only check after initial loading is complete
    if (!isLoading) {
      setIsInitialized(true);

      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        console.log("Not authenticated, redirecting to login");
        navigate("/doctor/login");
      } else if (userRole && userRole !== "doctor") {
        // Authenticated but not a doctor
        console.log("Not a doctor, showing error");
        setError(
          "You are not authorized to access this page. Please log in with a doctor account."
        );
      } else if (isDoctor && doctorData && doctorData.id) {
        // If doctor is authenticated and we have doctor data
        if (doctorId && doctorData.id !== doctorId) {
          // Doctor trying to access another doctor's dashboard
          console.log("Wrong doctor ID, redirecting");
          navigate(`/doctor/dashboard/${doctorData.id}`);
        } else if (!doctorId) {
          // No doctorId in URL, redirect to doctor's own dashboard
          console.log("No doctor ID in URL, redirecting");
          navigate(`/doctor/dashboard/${doctorData.id}`);
        }
        // Clear any existing errors when successfully authenticated
        setError(null);
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    userRole,
    isDoctor,
    doctorId,
    doctorData,
    navigate,
  ]);

  // Loading state - show loading only during initial load
  if (isLoading || (!isInitialized && !doctorData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              className="bg-blue-600 hover:bg-blue-700"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  // Main dashboard render
  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorDashboard doctorId={doctorData.id} doctorData={doctorData} />
    </div>
  );
}
