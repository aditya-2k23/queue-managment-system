import { useState, useEffect } from "react";
import { DoctorDashboard } from "@/components/DoctorDashboard";
import { doctorService } from "@/lib/database";
import { useSearchParams } from "react-router-dom";

export default function DoctorPage() {
  const [searchParams] = useSearchParams();
  const [doctorData, setDoctorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get doctor ID from URL params or use a default for demo
  const doctorId = searchParams.get("id") || "1";

  useEffect(() => {
    fetchDoctorData();
  }, [doctorId]);

  const fetchDoctorData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes, we'll use mock data if API fails
      const result = await doctorService.getDoctorsByHospital(doctorId);
      
      if (result.success && result.data && result.data.length > 0) {
        setDoctorData(result.data[0]);
      } else {
        // Mock data for demo
        setDoctorData({
          id: doctorId,
          name: "Sarah Johnson",
          specialization: "Cardiologist",
          room_number: "201",
          consultation_time: 15,
          max_patients_per_day: 30,
        });
      }
    } catch (err) {
      console.error("Error fetching doctor data:", err);
      setError("Failed to load doctor data");
      // Use mock data on error
      setDoctorData({
        id: doctorId,
        name: "Sarah Johnson",
        specialization: "Cardiologist",
        room_number: "201",
        consultation_time: 15,
        max_patients_per_day: 30,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading doctor dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !doctorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={fetchDoctorData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <DoctorDashboard doctorId={doctorId} doctorData={doctorData} />;
}
