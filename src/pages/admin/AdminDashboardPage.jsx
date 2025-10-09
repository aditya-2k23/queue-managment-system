import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Activity,
  Users,
  Clock,
  Settings,
  TrendingUp,
  TrendingDown,
  Hospital,
  Stethoscope,
} from "lucide-react";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [hospitalName] = useState("Care Plus Hospital");

  const stats = {
    activeDoctors: { value: 12, change: "+2 this month", trend: "up" },
    departments: { value: 8, change: "+1 this month", trend: "up" },
    todayQueue: { value: 45, change: "Current patients", trend: "neutral" },
    avgWaitTime: {
      value: "15 min",
      change: "-5 min from yesterday",
      trend: "down",
    },
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="px-6 md:px-8 py-4 md:py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                {hospitalName}
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                Administration Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all hidden md:flex"
            >
              <span className="mr-2">👨‍⚕️</span>
              Hospital Admin
            </Button>
            <Button
              onClick={() => navigate("/admin/login")}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 transition-all"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

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
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stats.activeDoctors.value}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">
                      {stats.activeDoctors.change}
                    </span>
                  </div>
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
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stats.departments.value}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">
                      {stats.departments.change}
                    </span>
                  </div>
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
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stats.todayQueue.value}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="w-3 h-3 text-orange-600" />
                    <span className="text-orange-600 font-medium">
                      {stats.todayQueue.change}
                    </span>
                  </div>
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
                  <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stats.avgWaitTime.value}
                  </p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingDown className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">
                      {stats.avgWaitTime.change}
                    </span>
                  </div>
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

        {/* Recent Activity */}
        <Card className="shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Last 24 hours
              </span>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                >
                  <div
                    className={`w-12 h-12 ${
                      activity.color === "teal"
                        ? "bg-blue-100"
                        : activity.color === "emerald"
                        ? "bg-green-100"
                        : activity.color === "blue"
                        ? "bg-orange-100"
                        : "bg-indigo-100"
                    } rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <activity.icon
                      className={`w-6 h-6 ${
                        activity.color === "teal"
                          ? "text-blue-600"
                          : activity.color === "emerald"
                          ? "text-green-600"
                          : activity.color === "blue"
                          ? "text-orange-600"
                          : "text-indigo-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 mb-1">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.subtitle}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
