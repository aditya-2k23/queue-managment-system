import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, Activity, Users, Clock, UserPlus, Calendar, Settings, TrendingUp, TrendingDown, Hospital, Stethoscope, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { hospitalService, activityService } from "@/lib/database";
import { toast } from "sonner";

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
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const hId = user.user_metadata?.hospital_id;
          if (hId) {
            setHospitalId(hId);
            localStorage.setItem("adminData", JSON.stringify({ hospital_id: hId, email: user.email }));
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
          activeDoctors: { value: data.doctorCount, change: "", trend: "neutral" },
            departments: { value: data.departmentCount, change: "", trend: "neutral" },
            todayQueue: { value: data.todayQueue, change: "Current patients", trend: "neutral" },
            avgWaitTime: { value: data.avgWaitTime ? `${data.avgWaitTime} min` : "--", change: "", trend: "neutral" },
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

  const [recentActivity, setRecentActivity] = useState([]);

  const relativeTime = (iso) => {
    if (!iso) return "just now";
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const iconFor = (type) => {
    switch (type) {
      case 'doctor': return Stethoscope;
      case 'department': return Hospital;
      case 'queue': return Users;
      case 'settings': return Settings;
      default: return Activity;
    }
  };

  const colorFor = (type) => {
    switch (type) {
      case 'doctor': return 'teal';
      case 'department': return 'emerald';
      case 'queue': return 'blue';
      case 'settings': return 'purple';
      default: return 'gray';
    }
  };

  const loadActivity = useCallback(async () => {
    if (!hospitalId) return;
    const result = await activityService.getRecentByHospital(hospitalId, 8);
    if (result.success) setRecentActivity(result.data);
  }, [hospitalId]);

  useEffect(() => { loadStats(); loadActivity(); }, [loadStats, loadActivity]);

  useEffect(() => {
    const handler = () => { loadStats(); loadActivity(); };
    window.addEventListener("hospital-data-changed", handler);
    return () => window.removeEventListener("hospital-data-changed", handler);
  }, [loadStats, loadActivity]);

  const quickActions = [
    {
      icon: UserPlus,
      label: "Add New Doctor",
      description: "Onboard a new doctor to your hospital",
    },
    {
      icon: Hospital,
      label: "Create Department",
      description: "Add a new department or specialty",
    },
    {
      icon: Calendar,
      label: "Manage Schedules",
      description: "Set doctor availability and timings",
    },
    {
      icon: Settings,
      label: "Hospital Settings",
      description: "Configure hospital preferences",
    },
  ];

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", subtitle: "Hospital overview", active: true, path: "/admin/dashboard" },
    { icon: Hospital, label: "Departments", subtitle: "Manage departments", active: false, path: "/admin/departments" },
    { icon: Stethoscope, label: "Doctors", subtitle: "Doctor management", active: false, path: "/admin/doctors" },
    { icon: BarChart3, label: "Analytics", subtitle: "Reports & insights", active: false, path: "/admin/analytics" },
    { icon: Settings, label: "Settings", subtitle: "Hospital settings", active: false, path: "/admin/settings" },
  ];

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
              <p className="text-xs text-gray-600">Hospital Administration Dashboard</p>
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
                <h1 className="text-xl font-bold text-gray-900">{hospitalName}</h1>
                <p className="text-sm text-gray-600">Hospital Administration Dashboard</p>
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

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back to {hospitalName}
            </h2>
            <p className="text-gray-600 text-lg">
              Here's what's happening in your hospital today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loadingStats && (
              <div className="col-span-full mb-2 text-sm text-gray-500 flex items-center gap-2">
                <span className="inline-block h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                Updating stats...
              </div>
            )}
            {/* Active Doctors */}
            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-teal-700 font-medium mb-2">
                      Active Doctors
                    </p>
                    <p className="text-4xl font-bold text-teal-900">
                      {stats.activeDoctors.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span className="text-teal-700 font-medium">
                    {stats.activeDoctors.change}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-emerald-700 font-medium mb-2">
                      Departments
                    </p>
                    <p className="text-4xl font-bold text-emerald-900">
                      {stats.departments.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Hospital className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">
                    {stats.departments.change}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Today's Queue */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-blue-700 font-medium mb-2">
                      Today's Queue
                    </p>
                    <p className="text-4xl font-bold text-blue-900">
                      {stats.todayQueue.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {stats.todayQueue.change}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Avg Wait Time */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-purple-700 font-medium mb-2">
                      Avg Wait Time
                    </p>
                    <p className="text-4xl font-bold text-purple-900">
                      {stats.avgWaitTime.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700 font-medium">
                    {stats.avgWaitTime.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Frequently used hospital management tasks
                </p>

                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-teal-300 transition-all text-left group"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                        <action.icon className="w-5 h-5 text-gray-600 group-hover:text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          {action.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Latest updates and changes in your hospital
                </p>

                <div className="space-y-4">
                  {recentActivity.length === 0 && (
                    <div className="p-6 text-center rounded-xl bg-gray-50 border border-dashed border-gray-300">
                      <p className="text-gray-600 font-medium mb-1">No recent activity</p>
                      <p className="text-xs text-gray-500">Actions you take (adding doctors/departments) will appear here.</p>
                    </div>
                  )}
                  {recentActivity.map((log) => {
                    const Icon = iconFor(log.entity_type);
                    const color = colorFor(log.entity_type);
                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200"
                      >
                        <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 mb-1">{log.title}</p>
                          {log.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{log.description}</p>
                          )}
                          <p className="text-xs text-gray-500">{relativeTime(log.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
