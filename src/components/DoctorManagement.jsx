import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Plus, Edit, Trash2, User } from "lucide-react";
import { doctorService } from "../lib/database";
import { toast } from "sonner";
import DoctorManagementModal from "./DoctorManagementModal";

const DoctorManagement = ({ hospitalId }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const loadDoctors = useCallback(async () => {
    setLoading(true);

    try {
      const result = await doctorService.getDoctorsByHospital(hospitalId);

      if (result.success) {
        const doctorData = result.data || [];
        setDoctors(doctorData);
      } else {
        console.error("Failed to load doctors:", result.error);
        toast.error("Failed to load doctors");
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error loading doctors:", error);
      toast.error("Error loading doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleAddDoctor = () => {
    setSelectedDoctor(null);
    setModalOpen(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const handleDeleteDoctor = async (doctor) => {
    if (
      !confirm(
        `Are you sure you want to delete Dr. ${doctor.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const result = await doctorService.deleteDoctor(doctor.id);
      if (result.success) {
        toast.success("Doctor deleted successfully");
        loadDoctors(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to delete doctor");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Error deleting doctor");
    }
  };

  const handleDoctorSaved = () => {
    loadDoctors(); // Refresh the list when a doctor is saved
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Doctor Management
              </CardTitle>
              <CardDescription>
                Manage doctors in your hospital. Create accounts, update
                information, and control access.
              </CardDescription>
            </div>
            <Button onClick={handleAddDoctor}>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm text-muted-foreground">
                Loading doctors...
              </p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">
                No Doctors Added Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't added any doctors to your hospital yet. Get started
                by adding your first doctor to the system.
              </p>
              <Button onClick={handleAddDoctor} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Doctor
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption>
                Total {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}{" "}
                in your hospital
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Available Days</TableHead>
                  <TableHead>Max Patients/Day</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{doctor.specialization}</Badge>
                    </TableCell>
                    <TableCell>
                      {doctor.departments ? doctor.departments.name : "N/A"}
                    </TableCell>
                    <TableCell>{doctor.room_number}</TableCell>
                    <TableCell>{doctor.available_days}</TableCell>
                    <TableCell>{doctor.max_patients_per_day}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDoctor(doctor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDoctor(doctor)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DoctorManagementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        doctor={selectedDoctor}
        hospitalId={hospitalId}
        onDoctorSaved={handleDoctorSaved}
      />
    </>
  );
};

export default DoctorManagement;
