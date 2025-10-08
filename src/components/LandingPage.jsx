import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Clock,
  Users,
  Smartphone,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Hospital,
  User,
  Calendar,
  Bell,
  MapPin,
  Star,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleDoctorDashboard = () => {
    navigate("/doctor?id=1");
  };

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                QueueCare
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleAdminLogin} className="text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl">
                <Hospital className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
              <Button variant="ghost" onClick={handleDoctorDashboard} className="text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-xl">
                <User className="w-4 h-4 mr-2" />
                Doctor Login
              </Button>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                Register Hospital
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 border-b border-border">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge
            variant="secondary"
            className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-teal-200 px-4 py-2 rounded-full text-sm font-semibold"
          >
            Transform Your Healthcare Experience
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            QueueCare -{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Smart Virtual Queue
            </span>{" "}
            Management
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Eliminate crowded waiting rooms and long queues. Let patients join
            virtual queues from anywhere and get real-time updates on their
            turn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="text-lg px-10 py-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl"
            >
              Register Your Hospital
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-6 border-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300 rounded-xl transition-all"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="text-center border-none shadow-md hover:shadow-lg transition-all bg-white rounded-2xl">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-2 text-foreground text-lg">
                Reduce Wait Times
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Average 60% reduction in waiting time
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-md hover:shadow-lg transition-all bg-white rounded-2xl">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-2 text-foreground text-lg">
                Reach More Patients
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Increase patient capacity by 40%
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-md hover:shadow-lg transition-all bg-white rounded-2xl">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-2 text-foreground text-lg">
                Mobile First
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Patients manage queues from their phones
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-none shadow-md hover:shadow-lg transition-all bg-white rounded-2xl">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold mb-2 text-foreground text-lg">
                Smart Analytics
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Real-time insights and reporting
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How QueueCare Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Simple workflow for hospitals and patients
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* For Hospitals */}
              <Card className="border-none shadow-lg rounded-3xl bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                      <Hospital className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      For Hospitals
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-700 text-lg font-bold">
                          1
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg mb-1">
                          Register Your Hospital
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Complete registration with hospital details and admin
                          information
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-700 text-lg font-bold">
                          2
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg mb-1">
                          Add Departments & Doctors
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Set up your departments, doctors, and their available
                          time slots
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-teal-700 text-lg font-bold">
                          3
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg mb-1">
                          Manage Queues
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Monitor real-time queues and call patients when ready
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* For Patients */}
              <Card className="border-none shadow-lg rounded-3xl bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      For Patients
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-700 text-lg font-bold">
                          1
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg mb-1">
                          Find & Select Hospital
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Search nearby hospitals and browse available doctors
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-700 text-lg font-bold">
                          2
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg mb-1">
                          Join Virtual Queue
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Get a token number and estimated waiting time
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-700 text-lg font-bold">
                          3
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg mb-1">
                          Wait From Anywhere
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Get real-time updates and notifications on your phone
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage queues efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-none bg-white shadow-sm hover:shadow-lg active:shadow-xl transition-all cursor-pointer rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-foreground text-xl">
                  Smart Scheduling
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Take hassle out of slot and patient management with automatic
                  patient assignment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-lg active:shadow-xl transition-all cursor-pointer rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center">
                  <Bell className="w-7 h-7 text-teal-600" />
                </div>
                <CardTitle className="text-foreground text-xl">
                  Real-time Notifications
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  SMS and app notifications to keep patients updated about their
                  turn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-lg active:shadow-xl transition-all cursor-pointer rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-foreground text-xl">
                  Multi-location Support
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Manage multiple hospital branches and departments from one
                  dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-lg active:shadow-xl transition-all cursor-pointer rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-amber-600" />
                </div>
                <CardTitle className="text-foreground text-xl">
                  Analytics Dashboard
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Track waiting times, patient flow, and optimize your
                  operations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-lg active:shadow-xl transition-all cursor-pointer rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-rose-600" />
                </div>
                <CardTitle className="text-foreground text-xl">
                  Patient Management
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Manage patient profiles with visit history and preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none bg-white shadow-sm hover:shadow-lg active:shadow-xl transition-all cursor-pointer rounded-2xl">
              <CardHeader className="space-y-3">
                <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
                  <Star className="w-7 h-7 text-yellow-600" />
                </div>
                <CardTitle className="text-foreground text-xl">
                  Reviews & Ratings
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Build trust with patient reviews and improve service quality
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="border-none shadow-xl rounded-3xl bg-white">
            <CardContent className="py-16 px-8">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Ready to Transform Your Hospital?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Join thousands of healthcare providers using QueueCare to
                  improve patient experience
                </p>
                <div className="pt-4">
                  <Button
                    onClick={handleGetStarted}
                    size="lg"
                    className="text-lg px-10 py-6 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-xl"
                  >
                    Start Free Registration
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-8 pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span>Free setup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span>24/7 support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    <span>No long-term contracts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {/* Brand Section */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">QueueCare</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Transform your healthcare facility with smart virtual queue
                management. Reduce wait times, increase patient satisfaction,
                and optimize operations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 QueueCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
