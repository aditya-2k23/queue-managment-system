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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 border-b border-border">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary border-primary/20"
          >
            Transform Your Healthcare Experience
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            QueueCare - Smart Virtual Queue Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Eliminate crowded waiting rooms and long queues. Let patients join
            virtual queues from anywhere and get real-time updates on their
            turn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="text-lg px-8 py-3"
            >
              Register Your Hospital
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="text-center border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">
                Reduce Wait Times
              </h3>
              <p className="text-sm text-muted-foreground">
                Average 60% reduction in waiting time
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">
                Reach More Patients
              </h3>
              <p className="text-sm text-muted-foreground">
                Increase patient capacity by 40%
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">
                Mobile First
              </h3>
              <p className="text-sm text-muted-foreground">
                Patients manage queues from their phones
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">
                Smart Analytics
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time insights and reporting
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/30 py-16">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* For Hospitals */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Hospital className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    For Hospitals
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary text-sm font-semibold">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Register Your Hospital
                      </h4>
                      <p className="text-muted-foreground">
                        Complete registration with hospital details and admin
                        information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary text-sm font-semibold">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Add Departments & Doctors
                      </h4>
                      <p className="text-muted-foreground">
                        Set up your departments, doctors, and their available
                        time slots
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary text-sm font-semibold">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Manage Queues
                      </h4>
                      <p className="text-muted-foreground">
                        Monitor real-time queues and call patients when ready
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Patients */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    For Patients
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 text-sm font-semibold">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Find & Select Hospital
                      </h4>
                      <p className="text-muted-foreground">
                        Search nearby hospitals and browse available doctors
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 text-sm font-semibold">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Join Virtual Queue
                      </h4>
                      <p className="text-muted-foreground">
                        Get a token number and estimated waiting time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 text-sm font-semibold">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Wait From Anywhere
                      </h4>
                      <p className="text-muted-foreground">
                        Get real-time updates and notifications on your phone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Calendar className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-foreground">
                  Smart Scheduling
                </CardTitle>
                <CardDescription>
                  Token-based or time-slot queue management with automatic
                  patient assignment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Bell className="w-8 h-8 text-emerald-600 mb-2" />
                <CardTitle className="text-foreground">
                  Real-time Notifications
                </CardTitle>
                <CardDescription>
                  SMS and app notifications to keep patients updated about their
                  turn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <MapPin className="w-8 h-8 text-violet-600 mb-2" />
                <CardTitle className="text-foreground">
                  Multi-location Support
                </CardTitle>
                <CardDescription>
                  Manage multiple hospital branches and departments from one
                  dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-amber-600 mb-2" />
                <CardTitle className="text-foreground">
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  Track waiting times, patient flow, and optimize your
                  operations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="w-8 h-8 text-rose-600 mb-2" />
                <CardTitle className="text-foreground">
                  Patient Management
                </CardTitle>
                <CardDescription>
                  Complete patient profiles with visit history and preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Star className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle className="text-foreground">
                  Reviews & Ratings
                </CardTitle>
                <CardDescription>
                  Build trust with patient reviews and improve service quality
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What Hospitals Say
              </h2>
              <p className="text-lg text-muted-foreground">
                Trusted by healthcare providers nationwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-border shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "QueueCare has transformed our patient experience. We've
                    reduced waiting times by 60% and our patient satisfaction
                    scores have never been higher."
                  </p>
                  <div className="font-semibold text-foreground">
                    Dr. Sarah Chen
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Chief Medical Officer, City General Hospital
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "The system is incredibly easy to use. Our staff learned it
                    in minutes, and patients love the convenience of virtual
                    queues."
                  </p>
                  <div className="font-semibold text-foreground">
                    Michael Rodriguez
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Operations Manager, Healthcare Plus
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-primary border-primary shadow-lg">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Hospital?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Join thousands of healthcare providers using QueueCare to
                improve patient experience
              </p>
              <div className="space-y-4">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3 bg-white text-primary hover:bg-gray-50"
                >
                  Start Free Registration
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-primary-foreground/80">
                  ✓ Free setup ✓ 24/7 support ✓ No long-term contracts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
