import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Clock,
  Settings,
  TrendingUp,
  TrendingDown,
  Hospital,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { hospitalService } from "@/lib/database";
import { toast } from "sonner";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [hospitalName, setHospitalName] = useState("Hospital");
  const [hospitalId, setHospitalId] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({
    activeDoctors: { value: 0, change: "", trend: "neutral" },
    departments: { value: 0, change: "", trend: "neutral" },
    todayQueue: { value: 0, change: "Current patients", trend: "neutral" },
    avgWaitTime: { value: "--", change: "", trend: "neutral" },
  });

  // Resolve hospital context
  useEffect(() => {
    const resolveHospital = async () => {
      try {
        const stored = localStorage.getItem("adminData");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.hospital_id) {
            setHospitalId(parsed.hospital_id);
            if (parsed.hospital_name) setHospitalName(parsed.hospital_name);
            return;
          }
        }
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const hId = user.user_metadata?.hospital_id;
          if (hId) {
            setHospitalId(hId);
            localStorage.setItem(
              "adminData",
              JSON.stringify({ hospital_id: hId, email: user.email })
            );
          }
        }
      } catch (err) {
        console.error("Hospital context error", err);
      }
    };
    resolveHospital();
  }, []);

  const loadStats = useCallback(async () => {
    if (!hospitalId) return;
    setLoadingStats(true);
    try {
      const result = await hospitalService.getDashboardStats(hospitalId);
      if (result.success) {
        const data = result.data;
        setStats({
          activeDoctors: {
            value: data.doctorCount,
            change: "",
            trend: "neutral",
          },
          departments: {
            value: data.departmentCount,
            change: "",
            trend: "neutral",
          },
          todayQueue: {
            value: data.todayQueue,
            change: "Current patients",
            trend: "neutral",
          },
          avgWaitTime: {
            value: data.avgWaitTime ? `${data.avgWaitTime} min` : "--",
            change: "",
            trend: "neutral",
          },
        });
      } else {
        toast.error(`Failed to load stats: ${result.error}`);
      }
    } catch (err) {
      console.error("Stats load error", err);
      toast.error("Error loading dashboard stats");
    } finally {
      setLoadingStats(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const handler = () => {
      loadStats();
    };
    window.addEventListener("hospital-data-changed", handler);
    return () => window.removeEventListener("hospital-data-changed", handler);
  }, [loadStats]);

  const tabItems = [
    {
      icon: Hospital,
      label: "Departments",
      path: "/admin/departments",
    },
    {
      icon: Stethoscope,
      label: "Doctors",
      path: "/admin/doctors",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader hospitalName={hospitalName} />

      {/* Dashboard Content */}
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Welcome back to {hospitalName}
          </h2>
          <p className="text-gray-600 text-base">
            Here's what's happening in your hospital today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {/* Active Doctors */}
          <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Active Doctors
                  </p>
                  {loadingStats ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {stats.activeDoctors.value}
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {stats.activeDoctors.change}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Departments */}
          <Card className="bg-white border border-green-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Departments
                  </p>
                  {loadingStats ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {stats.departments.value}
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {stats.departments.change}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                  <Hospital className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Queue */}
          <Card className="bg-white border border-orange-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Today's Queue
                  </p>
                  {loadingStats ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {stats.todayQueue.value}
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="w-3 h-3 text-orange-600" />
                        <span className="text-orange-600 font-medium">
                          {stats.todayQueue.change}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avg Wait Time */}
          <Card className="bg-white border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    Avg Wait Time
                  </p>
                  {loadingStats ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {stats.avgWaitTime.value}
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <TrendingDown className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {stats.avgWaitTime.change}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Navigation Cards */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tabItems.map((tab, index) => (
              <Card
                key={index}
                onClick={() => handleNavigate(tab.path)}
                className="cursor-pointer bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                      <tab.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tab.label}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {tab.label === "Departments" &&
                          "Manage hospital departments"}
                        {tab.label === "Doctors" && "View and manage doctors"}
                        {tab.label === "Settings" &&
                          "Configure hospital settings"}
                      </p>
                    </div>
                    <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
