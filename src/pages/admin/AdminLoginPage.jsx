import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  ArrowLeft,
  Activity,
  User,
  Lock,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospital: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Sign in with Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (authError) {
        setError(authError.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Get hospital admin details
        const { data: adminData, error: adminError } = await supabase
          .from("hospital_admins")
          .select("hospital_id, hospitals(id, name)")
          .eq("id", authData.user.id)
          .single();

        if (adminError || !adminData) {
          setError("Could not retrieve admin information");
          setIsLoading(false);
          return;
        }

        // Save to localStorage
        localStorage.setItem(
          "adminData",
          JSON.stringify({
            hospital_id: adminData.hospital_id,
            hospital_name: adminData.hospitals?.name || "Hospital",
            email: authData.user.email,
            user_id: authData.user.id,
          })
        );

        // Navigate to admin dashboard
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Main</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  QueueCare Hospital Admin
                </h1>
                <p className="text-sm text-gray-600">
                  Access your hospital's administration dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-none shadow-xl">
            <CardContent className="pt-12 pb-8 px-8">
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-3xl flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-teal-600" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Hospital Admin Login
                </h2>
                <p className="text-gray-600">
                  Sign in to access your hospital's administration dashboard
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Admin Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@hospital.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="pl-10 h-12 bg-gray-50 border-gray-200"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-10 h-12 bg-gray-50 border-gray-200"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In to Dashboard"}
                </Button>

                {/* Forgot Password */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
