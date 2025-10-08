import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  X,
  AlertCircle,
} from "lucide-react";
import { departmentService } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const emptyForm = { name: "", description: "" };

export function DepartmentsPage() {
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState("Hospital");
  const [hospitalId, setHospitalId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
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
          // Get hospital_id from user metadata or from hospital_admins table
          const userHospitalId = user.user_metadata?.hospital_id;

          if (userHospitalId) {
            setHospitalId(userHospitalId);
            // Save to localStorage for future use
            localStorage.setItem(
              "adminData",
              JSON.stringify({
                hospital_id: userHospitalId,
                email: user.email,
              })
            );
          } else {
            // Query hospital_admins table
            const { data: adminData, error: adminError } = await supabase
              .from("hospital_admins")
              .select("hospital_id, hospitals(name)")
              .eq("id", user.id)
              .single();

            if (adminData && !adminError) {
              setHospitalId(adminData.hospital_id);
              setHospitalName(adminData.hospitals?.name || "Hospital");
              // Save to localStorage
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

  // Fetch departments when hospitalId is available
  const loadDepartments = useCallback(async () => {
    if (!hospitalId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await departmentService.getDepartmentsByHospital(
        hospitalId
      );

      if (result.success) {
        setDepartments(result.data || []);
      } else {
        setError(result.error || "Failed to fetch departments");
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  // Calculate stats from departments
  const stats = {
    totalDepartments: departments.length,
    activeDepartments: departments.length, // All are active for now
    totalDoctors: departments.reduce(
      (sum, dept) => sum + (dept.doctor_count || 0),
      0
    ),
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      active: true,
      path: "/admin/departments",
    },
    {
      icon: Stethoscope,
      label: "Doctors",
      subtitle: "Doctor management",
      active: false,
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

  const openCreate = () => {
    setEditing(null);
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  const openEdit = (dept) => {
    setEditing(dept);
    setFormData({ name: dept.name, description: dept.description || "" });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditing(null);
    setFormData(emptyForm);
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (formData.name.length < 3) return "Name must be at least 3 characters";
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
        const result = await departmentService.updateDepartment(
          editing.id,
          formData
        );

        if (result.success) {
          toast.success("Department updated successfully!");
          handleCloseModal();
          loadDepartments();
        } else {
          toast.error(`Failed to update department: ${result.error}`);
        }
      } else {
        const result = await departmentService.createDepartment(
          formData,
          hospitalId
        );

        if (result.success) {
          toast.success("Department created successfully!");
          handleCloseModal();
          loadDepartments();
        } else {
          toast.error(`Failed to create department: ${result.error}`);
        }
      }
    } catch (err) {
      console.error("Error saving department:", err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async (dept) => {
    const confirmed = confirm(
      `Delete department "${dept.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const result = await departmentService.deleteDepartment(dept.id);

      if (result.success) {
        toast.success("Department deleted successfully!");
        loadDepartments();
      } else {
        toast.error(`Failed to delete department: ${result.error}`);
      }
    } catch (err) {
      console.error("Error deleting department:", err);
      toast.error("Error deleting department");
    }
  };

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
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
                Department Management
              </h2>
              <p className="text-gray-600">
                Manage departments for {hospitalName}
              </p>
            </div>
            <Button
              onClick={openCreate}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg"
              disabled={!hospitalId || loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Department
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
                      onClick={loadDepartments}
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
              <p className="mt-2 text-gray-600">Loading departments...</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Departments */}
            <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Hospital className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Total Departments
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalDepartments}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Departments */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Active Departments
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.activeDepartments}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
          </div>

          {/* Department Directory */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Department Directory
                </h3>
                <p className="text-gray-600 mb-4">
                  Manage departments for {hospitalName}
                </p>

                {/* Search Bar */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search departments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Department
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Description
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Doctors
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12">
                          <Hospital className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">
                            No departments found
                          </p>
                          <p className="text-sm text-gray-400">
                            {searchQuery
                              ? "Try adjusting your search"
                              : "Add your first department to get started"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredDepartments.map((dept) => (
                        <tr
                          key={dept.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                <Hospital className="w-5 h-5 text-cyan-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {dept.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {dept.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-gray-700">{dept.description}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {dept.doctor_count || 0} Doctors
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(dept)}
                                className="hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDepartment(dept)}
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

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="min-h-screen w-full flex items-center justify-center py-8">
            <Card className="w-full max-w-xl bg-white shadow-2xl border-none">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editing ? "Edit Department" : "Add New Department"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {editing
                        ? `Update ${editing.name}`
                        : `Create a new department for ${hospitalName}`}
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
                  {/* Department Name */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="deptName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Department Name
                    </Label>
                    <Input
                      id="deptName"
                      type="text"
                      placeholder="e.g., Cardiology"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-12 bg-white border-2 border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-base"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Description
                    </Label>
                    <textarea
                      id="description"
                      rows="4"
                      placeholder="Brief description of the department"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-700 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-8 h-11 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {saving
                        ? "Saving..."
                        : editing
                        ? "Update Department"
                        : "Add Department"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      disabled={saving}
                      className="px-8 h-11 border-gray-300 hover:bg-gray-50"
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
