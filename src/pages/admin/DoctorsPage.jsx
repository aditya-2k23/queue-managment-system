import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  ArrowLeft,
  Activity,
  Users,
  Hospital,
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Stethoscope,
  Settings,
  Clock,
  MapPin,
  X,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { doctorService, departmentService } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  specialization: "",
  email: "",
  password: "",
  department: "",
  availableDays: "",
  consultationTime: "",
  roomNumber: "",
  maxPatientsPerDay: "",
};

export function DoctorsPage() {
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState("Hospital");
  const [hospitalId, setHospitalId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Get hospital ID from authenticated user
  useEffect(() => {
    const getHospitalId = async () => {
      try {
        // Try to get from localStorage first
        const adminData = localStorage.getItem("adminData");
        if (adminData) {
          const parsed = JSON.parse(adminData);
          if (parsed.hospital_id) {
            setHospitalId(parsed.hospital_id);
            setHospitalName(parsed.hospital_name || "Hospital");
            return;
          }
        }

        // If not in localStorage, try to get from Supabase auth
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const userHospitalId = user.user_metadata?.hospital_id;

          if (userHospitalId) {
            setHospitalId(userHospitalId);
            localStorage.setItem(
              "adminData",
              JSON.stringify({
                hospital_id: userHospitalId,
                email: user.email,
              })
            );
          } else {
            const { data: adminData, error: adminError } = await supabase
              .from("hospital_admins")
              .select("hospital_id, hospitals(name)")
              .eq("id", user.id)
              .single();

            if (adminData && !adminError) {
              setHospitalId(adminData.hospital_id);
              setHospitalName(adminData.hospitals?.name || "Hospital");
              localStorage.setItem(
                "adminData",
                JSON.stringify({
                  hospital_id: adminData.hospital_id,
                  hospital_name: adminData.hospitals?.name,
                  email: user.email,
                })
              );
            } else {
              setError("Could not retrieve hospital information");
            }
          }
        } else {
          setError("No authenticated user found. Please login.");
        }
      } catch (err) {
        console.error("Error getting hospital ID:", err);
        setError("Failed to load hospital information");
      }
    };

    getHospitalId();
  }, []);

  // Fetch departments for the dropdown
  const loadDepartments = useCallback(async () => {
    if (!hospitalId) return;

    try {
      const result = await departmentService.getDepartmentsByHospital(
        hospitalId
      );
      if (result.success) {
        setDepartments(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }, [hospitalId]);

  // Fetch doctors when hospitalId is available
  const loadDoctors = useCallback(async () => {
    if (!hospitalId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await doctorService.getDoctorsByHospital(hospitalId);

      if (result.success) {
        setDoctors(result.data || []);
      } else {
        setError(result.error || "Failed to fetch doctors");
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    loadDoctors();
    loadDepartments();
  }, [loadDoctors, loadDepartments]);

  useEffect(() => {
    loadDoctors();
    loadDepartments();
  }, [loadDoctors, loadDepartments]);

  // Calculate stats from doctors
  const stats = {
    totalDoctors: doctors.length,
    activeDoctors: doctors.length, // All are active for now
    currentPatients: 0, // Would need appointments table
    dailyCapacity: doctors.reduce(
      (sum, doc) => sum + (parseInt(doc.max_patients_per_day) || 0),
      0
    ),
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.specialization &&
        doctor.specialization
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));
    const matchesDepartment =
      departmentFilter === "all" || doctor.department_id === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const sidebarItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      subtitle: "Hospital overview",
      active: false,
      path: "/admin/dashboard",
    },
    {
      icon: Hospital,
      label: "Departments",
      subtitle: "Manage departments",
      active: false,
      path: "/admin/departments",
    },
    {
      icon: Stethoscope,
      label: "Doctors",
      subtitle: "Doctor management",
      active: true,
      path: "/admin/doctors",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      subtitle: "Reports & insights",
      active: false,
      path: "/admin/analytics",
    },
    {
      icon: Settings,
      label: "Settings",
      subtitle: "Hospital settings",
      active: false,
      path: "/admin/settings",
    },
  ];

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  const openEdit = (doctor) => {
    setEditing(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization || "",
      email: doctor.email || "",
      password: "", // Don't populate password for editing
      department: doctor.department_id || "",
      availableDays: doctor.available_days || "",
      consultationTime: doctor.consultation_time || "",
      roomNumber: doctor.room_number || "",
      maxPatientsPerDay: doctor.max_patients_per_day?.toString() || "",
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditing(null);
    setFormData(emptyForm);
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!editing && !formData.password) return "Password is required";
    if (!formData.department) return "Department is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    if (!hospitalId) {
      toast.error("Hospital ID not found. Please login again.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        // Update existing doctor
        const updates = {
          name: formData.name,
          email: formData.email,
          specialization: formData.specialization,
          department_id: formData.department,
          available_days: formData.availableDays,
          consultation_time: formData.consultationTime,
          room_number: formData.roomNumber,
          max_patients_per_day: parseInt(formData.maxPatientsPerDay) || null,
        };

        const result = await doctorService.updateDoctor(editing.id, updates);

        if (result.success) {
          toast.success("Doctor updated successfully!");
          handleCloseModal();
          loadDoctors();
        } else {
          toast.error(`Failed to update doctor: ${result.error}`);
        }
      } else {
        // Create new doctor
        const doctorData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          specialization: formData.specialization,
          availableDays: formData.availableDays,
          consultationTime: formData.consultationTime,
          roomNumber: formData.roomNumber,
          maxPatientsPerDay: parseInt(formData.maxPatientsPerDay) || null,
        };

        const result = await doctorService.createDoctor(
          doctorData,
          hospitalId,
          formData.department
        );

        if (result.success) {
          toast.success("Doctor created successfully!");
          handleCloseModal();
          loadDoctors();
        } else {
          toast.error(`Failed to create doctor: ${result.error}`);
        }
      }
    } catch (err) {
      console.error("Error saving doctor:", err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    const confirmed = confirm(
      `Delete doctor "${doctor.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const result = await doctorService.deleteDoctor(doctor.id);

      if (result.success) {
        toast.success("Doctor deleted successfully!");
        loadDoctors();
      } else {
        toast.error(`Failed to delete doctor: ${result.error}`);
      }
    } catch (err) {
      console.error("Error deleting doctor:", err);
      toast.error("Error deleting doctor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{hospitalName}</h2>
              <p className="text-xs text-gray-600">
                Hospital Administration Dashboard
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? "bg-cyan-50 text-teal-700 border border-teal-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <div className="text-left flex-1">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs opacity-75">{item.subtitle}</p>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => navigate("/admin/login")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Back to Login</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {hospitalName}
                </h1>
                <p className="text-sm text-gray-600">
                  Hospital Administration Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Hospital Admin
              </Button>
              <Button
                onClick={() => navigate("/admin/login")}
                variant="outline"
                className="border-gray-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Doctor Management
              </h2>
              <p className="text-gray-600">
                Manage doctor profiles and schedules for {hospitalName}
              </p>
            </div>
            <Button
              onClick={openCreate}
              disabled={!hospitalId || loading}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Doctor
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-700 font-medium">Error: {error}</p>
                  {error.includes("login") && (
                    <Button
                      onClick={() => navigate("/admin/login")}
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      Go to Login
                    </Button>
                  )}
                  {!error.includes("login") && (
                    <Button
                      onClick={loadDoctors}
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="mb-6 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-2 text-gray-600">Loading doctors...</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Doctors */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Doctors</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalDoctors}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Doctors */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.activeDoctors}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Patients */}
            <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Current Patients
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.currentPatients}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Capacity */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Daily Capacity</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.dailyCapacity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Directory */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Doctor Directory
                </h3>
                <p className="text-gray-600 mb-4">
                  Manage doctor profiles and schedules
                </p>

                {/* Filters */}
                <div className="flex gap-4">
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-64 h-11 bg-gray-50 border-gray-200">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search doctors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Doctor
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Department
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Schedule
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Capacity
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12">
                          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">
                            No doctors found
                          </p>
                          <p className="text-sm text-gray-400">
                            {searchQuery
                              ? "Try adjusting your search"
                              : "Add your first doctor to get started"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredDoctors.map((doctor) => (
                        <tr
                          key={doctor.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-cyan-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {doctor.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {doctor.specialization}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Hospital className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">
                                {doctor.departments?.name || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <p className="text-gray-900 font-medium">
                                {doctor.available_days || "N/A"}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{doctor.consultation_time || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="w-3 h-3" />
                                <span>Room: {doctor.room_number || "N/A"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-2">
                              <p className="font-bold text-teal-600">
                                {doctor.max_patients_per_day || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">per day</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-700 border-emerald-200"
                            >
                              Active
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(doctor)}
                                className="hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDoctor(doctor)}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="min-h-screen w-full flex items-center justify-center py-8">
            <Card className="w-full max-w-2xl bg-white shadow-2xl border-none">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editing ? "Edit Doctor" : "Add New Doctor"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {editing
                        ? `Update ${editing.name}'s information`
                        : "Register a new doctor in the system"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseModal}
                    className="hover:bg-gray-100 rounded-lg h-10 w-10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Doctor Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Doctor Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Dr. John Smith"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required
                      />
                    </div>

                    {/* Specialization */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="specialization"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Specialization
                      </Label>
                      <Input
                        id="specialization"
                        type="text"
                        placeholder="e.g., Cardiologist"
                        value={formData.specialization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialization: e.target.value,
                          })
                        }
                        className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required
                      />
                    </div>

                    {/* Password */}
                    {!editing && (
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="password"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter secure password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                          required
                        />
                      </div>
                    )}

                    {/* Department */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="department"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Department
                      </Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          setFormData({ ...formData, department: value })
                        }
                      >
                        <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200">
                          <SelectValue placeholder="Select department" />
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

                    {/* Available Days */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="availableDays"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Available Days
                      </Label>
                      <Input
                        id="availableDays"
                        type="text"
                        placeholder="Mon-Fri or Mon-Wed-Fri"
                        value={formData.availableDays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            availableDays: e.target.value,
                          })
                        }
                        className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required
                      />
                    </div>

                    {/* Consultation Time */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="consultationTime"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Consultation Time
                      </Label>
                      <Input
                        id="consultationTime"
                        type="text"
                        placeholder="09:00-17:00"
                        value={formData.consultationTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            consultationTime: e.target.value,
                          })
                        }
                        className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required
                      />
                    </div>

                    {/* Room Number */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="roomNumber"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Room Number
                      </Label>
                      <Input
                        id="roomNumber"
                        type="text"
                        placeholder="C-101"
                        value={formData.roomNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            roomNumber: e.target.value,
                          })
                        }
                        className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required
                      />
                    </div>

                    {/* Max Patients Per Day */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="maxPatients"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Max Patients/Day
                      </Label>
                      <Input
                        id="maxPatients"
                        type="number"
                        placeholder="20"
                        value={formData.maxPatientsPerDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxPatientsPerDay: e.target.value,
                          })
                        }
                        className="h-10 bg-white border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 h-10 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {saving
                        ? "Saving..."
                        : editing
                        ? "Update Doctor"
                        : "Add Doctor"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      disabled={saving}
                      className="px-8 h-10 border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
