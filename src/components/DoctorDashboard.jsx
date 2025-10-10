import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  User,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Users,
  Activity,
  TrendingUp,
  FileText,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { queueService } from "@/lib/database";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export function DoctorDashboard({ doctorId, doctorData }) {
  const [queue, setQueue] = useState([]);
  const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    completed: 0,
    inProgress: 0,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch queue data
  useEffect(() => {
    fetchQueueData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchQueueData, 30000);
    return () => clearInterval(interval);
  }, [doctorId, selectedDate]);

  const fetchQueueData = async () => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const result = await queueService.getQueueByDoctorAndDate(
        doctorId,
        dateStr
      );

      if (result.success && result.data) {
        setQueue(result.data);
        calculateStats(result.data);

        // Find current patient (first waiting patient)
        const currentIndex = result.data.findIndex(
          (item) => item.status === "waiting" || item.status === "in-progress"
        );
        if (currentIndex !== -1) {
          setCurrentPatientIndex(currentIndex);
        }
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (queueData) => {
    setStats({
      total: queueData.length,
      waiting: queueData.filter((item) => item.status === "waiting").length,
      completed: queueData.filter((item) => item.status === "completed").length,
      inProgress: queueData.filter((item) => item.status === "in-progress")
        .length,
    });
  };

  const handleNextPatient = () => {
    if (currentPatientIndex < queue.length - 1) {
      setCurrentPatientIndex(currentPatientIndex + 1);
    }
  };

  const handleMarkInProgress = async () => {
    const patient = queue[currentPatientIndex];
    if (!patient) return;

    try {
      const result = await queueService.updateQueueStatus(
        patient.id,
        "in-progress"
      );
      if (result.success) {
        toast.success("Consultation started");
        fetchQueueData();
      } else {
        toast.error("Failed to update patient status");
      }
    } catch (error) {
      console.error("Error marking in progress:", error);
      toast.error("An error occurred");
    }
  };

  const handleMarkCompleted = async () => {
    const patient = queue[currentPatientIndex];
    if (!patient) return;

    try {
      const result = await queueService.updateQueueStatus(
        patient.id,
        "completed"
      );
      if (result.success) {
        toast.success("Consultation completed");
        fetchQueueData();
        // Move to next waiting patient
        handleNextPatient();
      } else {
        toast.error("Failed to complete consultation");
      }
    } catch (error) {
      console.error("Error marking completed:", error);
      toast.error("An error occurred");
    }
  };

  const handleMarkNoShow = async () => {
    const patient = queue[currentPatientIndex];
    if (!patient) return;

    try {
      const result = await queueService.updateQueueStatus(
        patient.id,
        "no-show"
      );
      if (result.success) {
        toast.success("Patient marked as no-show");
        fetchQueueData();
        handleNextPatient();
      } else {
        toast.error("Failed to update patient status");
      }
    } catch (error) {
      console.error("Error marking no-show:", error);
      toast.error("An error occurred");
    }
  };

  const currentPatient = queue[currentPatientIndex];

  const getStatusBadge = (status) => {
    switch (status) {
      case "waiting":
        return (
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300 px-3 py-1 rounded-lg font-semibold"
          >
            <Clock className="w-3 h-3 mr-1" />
            Waiting
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="default"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg font-semibold shadow-md"
          >
            <Activity className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="default"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-lg font-semibold shadow-md"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "no-show":
        return (
          <Badge
            variant="destructive"
            className="bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 rounded-lg font-semibold shadow-md"
          >
            <XCircle className="w-3 h-3 mr-1" />
            No Show
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/doctor/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="px-6 md:px-8 py-4 md:py-5 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                Dr. {doctorData?.name || "Doctor"}
              </h1>
              <p className="text-xs md:text-sm text-gray-600">
                {doctorData?.specialization || "Specialist"} • Room{" "}
                {doctorData?.room_number || "--"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all"
              onClick={fetchQueueData}
            >
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-gray-300 hover:bg-gray-50 transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Queue */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-blue-50 border-blue-200 border shadow-sm">
              <CardHeader className="border-b border-blue-200 bg-white/50">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Upcoming Queue
                </CardTitle>
                <CardDescription className="text-gray-600">
                  <span className="text-orange-600 font-semibold">
                    {stats.waiting} waiting
                  </span>{" "}
                  •{" "}
                  <span className="text-emerald-600 font-semibold">
                    {stats.completed} completed
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Activity className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : queue.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-gray-700 font-medium">
                      No patients scheduled
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-12 h-12 text-blue-400" />
                    </div>
                    <p className="text-gray-700 font-medium text-sm mb-4">
                      No patients scheduled
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Current Patient Card */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white border-gray-200 border shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    Current Patient Queue
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Your primary workspace for managing patients
                </CardDescription>
                {queue.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing patient {currentPatientIndex + 1} of {queue.length}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Activity className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : !currentPatient || queue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                      <Users className="w-12 h-12 text-blue-400" />
                    </div>
                    <p className="text-gray-900 font-semibold text-lg mb-2">
                      No patients in queue
                    </p>
                    <p className="text-gray-600 text-sm mb-6 max-w-md text-center">
                      Patients will appear here when they join the queue. You
                      can then manage their appointments and call them when
                      ready.
                    </p>
                    <div className="flex gap-3">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Users className="w-4 h-4 mr-2" />
                        Start Consulting
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        End Consultation
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Patient Info */}
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-bold text-slate-800">
                              {currentPatient.patient_name}
                            </h3>
                            {getStatusBadge(currentPatient.status)}
                          </div>
                          <p className="text-muted-foreground font-medium">
                            Token #{currentPatient.token_number}
                          </p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-2xl font-bold text-white">
                            #{currentPatient.token_number}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Phone
                            </p>
                            <p className="font-medium">
                              {currentPatient.patient_phone || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Email
                            </p>
                            <p className="font-medium">
                              {currentPatient.patient_email || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Appointment Time
                            </p>
                            <p className="font-medium">
                              {formatTime(currentPatient.appointment_time)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Queue Position
                            </p>
                            <p className="font-medium">
                              {currentPatientIndex + 1} of {queue.length}
                            </p>
                          </div>
                        </div>
                      </div>

                      {currentPatient.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-muted-foreground mb-1">
                            Notes
                          </p>
                          <p className="text-sm">{currentPatient.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {currentPatient.status === "waiting" && (
                        <>
                          <Button
                            onClick={handleMarkInProgress}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all rounded-xl py-6 text-base font-semibold"
                          >
                            <Activity className="w-5 h-5 mr-2" />
                            Start Consultation
                          </Button>
                          <Button
                            onClick={handleMarkNoShow}
                            variant="destructive"
                            className="rounded-xl py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            <XCircle className="w-5 h-5 mr-2" />
                            Mark No Show
                          </Button>
                        </>
                      )}

                      {currentPatient.status === "in-progress" && (
                        <Button
                          onClick={handleMarkCompleted}
                          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all md:col-span-2 rounded-xl py-6 text-base font-semibold"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Complete Consultation
                        </Button>
                      )}

                      {(currentPatient.status === "completed" ||
                        currentPatient.status === "no-show") && (
                        <div className="md:col-span-3 text-center py-4 text-muted-foreground">
                          This consultation has been{" "}
                          {currentPatient.status === "completed"
                            ? "completed"
                            : "marked as no-show"}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
