import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Hospital,
  UserCheck,
  Clock,
  BarChart3,
  Stethoscope,
  Home,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import DoctorManagement from "@/components/DoctorManagement";
import DepartmentManagement from "@/components/DepartmentManagement";

export default function AdminDashboard() {
  const { user, adminData, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const hospitalName = adminData?.hospitals?.name || "Hospital";
  const adminName = adminData?.name || user?.user_metadata?.name || "Admin";
  const hospitalId = adminData?.hospital_id;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {hospitalName} - Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {adminName}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="doctors" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctors
              </TabsTrigger>
              <TabsTrigger
                value="departments"
                className="flex items-center gap-2"
              >
                <Hospital className="h-4 w-4" />
                Departments
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patients
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Patients Today
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Queues
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      Across 5 departments
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Wait Time
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24 min</div>
                    <p className="text-xs text-muted-foreground">
                      -8 min from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Patient Satisfaction
                    </CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-muted-foreground">
                      +2% this week
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Today's Schedule & Department Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Today's Schedule Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Cardiology Department</p>
                            <p className="text-sm text-muted-foreground">
                              3 Doctors • 24 Patients
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">
                            Active
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg wait: 18 min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Neurology Department</p>
                            <p className="text-sm text-muted-foreground">
                              2 Doctors • 12 Patients
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            Active
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg wait: 15 min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Pediatrics Department</p>
                            <p className="text-sm text-muted-foreground">
                              4 Doctors • 18 Patients
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-purple-600">
                            Active
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg wait: 22 min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Orthopedics Department
                            </p>
                            <p className="text-sm text-muted-foreground">
                              2 Doctors • 8 Patients
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600">
                            Active
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg wait: 12 min
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Database</span>
                        </div>
                        <span className="text-xs font-medium text-green-600">
                          Operational
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Queue System</span>
                        </div>
                        <span className="text-xs font-medium text-green-600">
                          Running
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Auth Service</span>
                        </div>
                        <span className="text-xs font-medium text-green-600">
                          Active
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Notifications</span>
                        </div>
                        <span className="text-xs font-medium text-yellow-600">
                          Pending
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            System Uptime
                          </span>
                          <span className="text-sm font-medium">99.9%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Last Backup
                          </span>
                          <span className="text-sm font-medium">
                            2 hours ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Performance</p>
                          <p className="text-xs text-muted-foreground">
                            All systems optimal
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm">Patient John Doe checked in</p>
                        <p className="text-xs text-muted-foreground">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          Dr. Smith updated availability
                        </p>
                        <p className="text-xs text-muted-foreground">
                          15 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm">
                          Queue #5 has 3 waiting patients
                        </p>
                        <p className="text-xs text-muted-foreground">
                          25 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                      <div className="flex-1">
                        <p className="text-sm">New patient registered</p>
                        <p className="text-xs text-muted-foreground">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctors">
              <DoctorManagement hospitalId={hospitalId} />
            </TabsContent>

            <TabsContent value="departments">
              <DepartmentManagement hospitalId={hospitalId} />
            </TabsContent>

            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Patient management functionality will be implemented here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
