import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { departmentService, doctorService } from "../lib/database";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import AdminPasswordConfirmDialog from "./AdminPasswordConfirmDialog";

const DoctorManagementModal = ({
  isOpen,
  onClose,
  doctor = null, // If editing, doctor object is passed
  hospitalId,
  onDoctorSaved,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    departmentId: "",
    availableDays: "",
    consultationTime: "",
    roomNumber: "",
    maxPatientsPerDay: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [pendingDoctorData, setPendingDoctorData] = useState(null);

  const isEditMode = !!doctor;

  const loadDepartments = useCallback(async () => {
    setDepartmentsLoading(true);
    try {
      const result = await departmentService.getDepartmentsByHospital(
        hospitalId
      );
      if (result.success) {
        setDepartments(result.data);
      } else {
        toast.error("Failed to load departments");
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Error loading departments");
    } finally {
      setDepartmentsLoading(false);
    }
  }, [hospitalId]);

  // Load departments when modal opens
  useEffect(() => {
    if (isOpen && hospitalId) {
      loadDepartments();
    }
  }, [isOpen, hospitalId, loadDepartments]);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && doctor) {
      setFormData({
        name: doctor.name || "",
        email: doctor.email || "",
        password: "", // Don't populate password for editing
        specialization: doctor.specialization || "",
        departmentId: doctor.department_id || "",
        availableDays: doctor.available_days || "",
        consultationTime: doctor.consultation_time || "",
        roomNumber: doctor.room_number || "",
        maxPatientsPerDay: doctor.max_patients_per_day || "",
      });
    } else {
      // Reset form for new doctor
      setFormData({
        name: "",
        email: "",
        password: "",
        specialization: "",
        departmentId: "",
        availableDays: "",
        consultationTime: "",
        roomNumber: "",
        maxPatientsPerDay: "",
      });
    }
  }, [isEditMode, doctor, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!isEditMode && !formData.password.trim())
      errors.push("Password is required");
    if (!formData.specialization.trim())
      errors.push("Specialization is required");
    if (!formData.departmentId) errors.push("Department is required");
    if (!formData.availableDays.trim())
      errors.push("Available days is required");
    if (!formData.consultationTime.trim())
      errors.push("Consultation time is required");
    if (!formData.roomNumber.trim()) errors.push("Room number is required");
    if (!formData.maxPatientsPerDay.trim())
      errors.push("Max patients per day is required");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Validate max patients per day is a number
    if (
      formData.maxPatientsPerDay &&
      isNaN(parseInt(formData.maxPatientsPerDay))
    ) {
      errors.push("Max patients per day must be a number");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    // For editing, proceed directly
    if (isEditMode) {
      setLoading(true);
      try {
        const updateData = {
          name: formData.name,
          email: formData.email,
          specialization: formData.specialization,
          department_id: formData.departmentId,
          available_days: formData.availableDays,
          consultation_time: formData.consultationTime,
          room_number: formData.roomNumber,
          max_patients_per_day: parseInt(formData.maxPatientsPerDay),
        };

        const result = await doctorService.updateDoctor(doctor.id, updateData);

        if (result.success) {
          toast.success("Doctor updated successfully!");
          onDoctorSaved?.(result.data);
          onClose();
        } else {
          toast.error(result.error || "Update failed");
        }
      } catch (error) {
        console.error("Error updating doctor:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
      return;
    }

    // For creating new doctor, show password confirmation
    const doctorData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      specialization: formData.specialization,
      availableDays: formData.availableDays,
      consultationTime: formData.consultationTime,
      roomNumber: formData.roomNumber,
      maxPatientsPerDay: parseInt(formData.maxPatientsPerDay),
    };

    setPendingDoctorData(doctorData);
    setShowPasswordConfirm(true);
  };

  const handlePasswordConfirm = async (adminPassword) => {
    if (loading) return; // prevent duplicate triggers
    if (!pendingDoctorData) return;

    setLoading(true);
    const adminEmail = user?.email;
    const adminCredentials = { email: adminEmail, password: adminPassword };

    // Add a timeout in case network/auth hangs and never resolves
    const timeoutMs = 2000; // 2s safeguard
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Doctor creation timed out")),
        timeoutMs
      )
    );

    try {
      const result = await Promise.race([
        doctorService.createDoctor(
          pendingDoctorData,
          hospitalId,
          formData.departmentId,
          adminCredentials
        ),
        timeoutPromise,
      ]);

      if (result?.success) {
        toast.success("Doctor created successfully!");
        onDoctorSaved?.(result.data);
        setShowPasswordConfirm(false);
        setPendingDoctorData(null);
        onClose();
      } else if (result && !result.success) {
        toast.error(result.error || "Doctor creation failed");
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordConfirmClose = () => {
    setShowPasswordConfirm(false);
    setPendingDoctorData(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Doctor" : "Add New Doctor"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update doctor information and settings."
                : "Create a new doctor account with login credentials."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="doctor@hospital.com"
                  required
                />
              </div>
            </div>

            {!isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Temporary password (doctor should change)"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  placeholder="Cardiology, Neurology, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) =>
                    handleInputChange("departmentId", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        departmentsLoading ? "Loading..." : "Select department"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableDays">Available Days</Label>
                <Input
                  id="availableDays"
                  value={formData.availableDays}
                  onChange={(e) =>
                    handleInputChange("availableDays", e.target.value)
                  }
                  placeholder="Mon-Fri, Weekends"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultationTime">Consultation Time</Label>
                <Input
                  id="consultationTime"
                  value={formData.consultationTime}
                  onChange={(e) =>
                    handleInputChange("consultationTime", e.target.value)
                  }
                  placeholder="9:00 AM - 5:00 PM"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    handleInputChange("roomNumber", e.target.value)
                  }
                  placeholder="Room 101"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPatientsPerDay">Max Patients/Day</Label>
                <Input
                  id="maxPatientsPerDay"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxPatientsPerDay}
                  onChange={(e) =>
                    handleInputChange("maxPatientsPerDay", e.target.value)
                  }
                  placeholder="20"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Doctor"
                  : "Create Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AdminPasswordConfirmDialog
        isOpen={showPasswordConfirm}
        onClose={handlePasswordConfirmClose}
        onConfirm={handlePasswordConfirm}
        adminEmail={user?.email}
        loading={loading}
      />
    </>
  );
};

export default DoctorManagementModal;
