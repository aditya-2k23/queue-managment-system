import { useState } from "react";
import { StepIndicator } from "@/components/StepIndicator";
import { AdminRegistrationForm } from "@/components/AdminRegistrationForm";
import { HospitalRegistrationForm } from "@/components/HospitalRegistrationForm";
import { SuccessMessage } from "@/components/SuccessMessage";
import { useNavigate } from "react-router-dom";
import { registrationService } from "@/lib/database";
import bcrypt from "bcryptjs";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [adminData, setAdminData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const steps = ["Admin Account", "Hospital Details", "Confirmation"];

  const handleAdminSubmit = (data) => {
    setAdminData(data);
    setCurrentStep(2);
  };

  const handleHospitalSubmit = async (data) => {
    setHospitalData(data);
    setIsLoading(true);
    setError(null);

    try {
      if (
        !adminData ||
        !adminData.name ||
        !adminData.email ||
        !adminData.password
      ) {
        throw new Error(
          "Admin data is missing. Please go back and complete the admin registration step."
        );
      }

      // Hash the admin password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(adminData.password, saltRounds);

      // Prepare data for database
      const hospitalPayload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        registrationNumber: data.registrationNumber,
      };

      const adminPayload = {
        name: adminData.name,
        email: adminData.email,
        rawPassword: adminData.password, // Raw password for Supabase Auth
        passwordHash: passwordHash, // Hashed password for database backup
        role: "admin",
      };

      console.log("Submitting hospital registration data...");
      console.log("Admin data:", adminData);
      console.log("Hospital data:", data);
      console.log("Hospital payload:", hospitalPayload);
      console.log("Admin payload:", adminPayload);

      // Save to database via Supabase
      const result = await registrationService.registerHospital(
        hospitalPayload,
        adminPayload
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log("Hospital registered successfully:", result.data);
      setCurrentStep(3);
    } catch (error) {
      console.error("Error saving hospital data:", error);
      setError(
        error.message || "Failed to register hospital. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      navigate("/");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hospital Registration
          </h1>
          <p className="text-muted-foreground">
            Complete your registration to join the QueueCare platform
          </p>
        </div>

        {/* Step Indicator */}
        {currentStep < 3 && (
          <StepIndicator
            currentStep={currentStep}
            totalSteps={3}
            steps={steps}
          />
        )}

        {/* Form Content */}
        <div className="flex justify-center">
          {error && (
            <div className="w-full max-w-md mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {currentStep === 1 && (
            <AdminRegistrationForm onSubmit={handleAdminSubmit} />
          )}

          {currentStep === 2 && (
            <HospitalRegistrationForm
              onSubmit={handleHospitalSubmit}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}

          {currentStep === 3 && adminData && hospitalData && (
            <SuccessMessage
              adminData={adminData}
              hospitalData={hospitalData}
              onGoToDashboard={handleGoToDashboard}
            />
          )}
        </div>
      </div>
    </div>
  );
}
