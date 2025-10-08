import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ArrowLeft,
  Activity,
  Users,
  Clock,
  UserPlus,
  Calendar,
  Settings,
  TrendingUp,
  TrendingDown,
  Hospital,
  Stethoscope,
  BarChart3,
} from "lucide-react";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [hospitalName] = useState("Care Plus Hospital");

  const stats = {
    activeDoctors: { value: 12, change: "+2 this month", trend: "up" },
    departments: { value: 8, change: "+1 this month", trend: "up" },
    todayQueue: { value: 45, change: "Current patients", trend: "neutral" },
    avgWaitTime: { value: "15 min", change: "-5 min from yesterday", trend: "down" },
  };

  const recentActivity = [
    {
      id: 1,
      type: "doctor",
      title: "New doctor onboarded",
      subtitle: "Dr. Priya Sharma - Cardiology",
      time: "2 hours ago",
      icon: Stethoscope,
      color: "teal",
    },
    {
      id: 2,
      type: "department",
      title: "Department updated",
      subtitle: "Radiology - Added new equipment",
      time: "4 hours ago",
      icon: Hospital,
      color: "emerald",
    },
    {
      id: 3,
      type: "queue",
      title: "Queue completed",
      subtitle: "Orthopedics - 25 patients served",
      time: "6 hours ago",
      icon: Users,
      color: "blue",
    },
    {
      id: 4,
      type: "settings",
      title: "Settings modified",
      subtitle: "Updated hospital timings",
      time: "1 day ago",
      icon: Settings,
      color: "purple",
    },
  ];

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
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <div
                        className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <activity.icon
                          className={`w-5 h-5 text-${activity.color}-600`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 mb-1">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.subtitle}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
