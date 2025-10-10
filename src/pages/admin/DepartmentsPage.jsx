import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Hospital,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  ArrowLeft,
  Building2,
  Stethoscope,
} from "lucide-react";
import { departmentService } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";

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

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          window.dispatchEvent(
            new CustomEvent("hospital-data-changed", {
              detail: { entity: "department", action: "update" },
            })
          );
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
          window.dispatchEvent(
            new CustomEvent("hospital-data-changed", {
              detail: { entity: "department", action: "create" },
            })
          );
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
        window.dispatchEvent(
          new CustomEvent("hospital-data-changed", {
            detail: { entity: "department", action: "delete" },
          })
        );
      } else {
        toast.error(`Failed to delete department: ${result.error}`);
      }
    } catch (err) {
      console.error("Error deleting department:", err);
      toast.error("Error deleting department");
    }
  };

  const stats = {
    totalDepartments: departments.length,
    activeDepartments: departments.length,
    totalDoctors: departments.reduce(
      (sum, dept) => sum + (dept.doctor_count || 0),
      0
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminDashboardHeader hospitalName={hospitalName} />

      {/* Main Content */}
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Department Management
            </h2>
            <p className="text-gray-600">
              Manage departments for {hospitalName}
            </p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading departments...</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Total Departments */}
          <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Hospital className="w-6 h-6 text-blue-600" />
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
          <Card className="bg-white border border-green-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
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
          <Card className="bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-indigo-600" />
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
        <Card className="shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Department Directory
                  </h3>
                </div>
              </div>

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
                      className="h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base"
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
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-gray-700 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 h-11 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
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
