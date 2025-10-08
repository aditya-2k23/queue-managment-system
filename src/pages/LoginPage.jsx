import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authService } from "@/lib/auth";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.signIn(
        formData.email,
        formData.password
      );

      if (!result.success) {
        if (result.error.includes("Invalid login credentials")) {
          setErrors({ submit: "Invalid email or password" });
        } else {
          setErrors({ submit: result.error });
        }
        return;
      }

      // Check if user is a hospital admin
      if (!result.data.adminData) {
        setErrors({
          submit:
            "Access denied. This login is for hospital administrators only.",
        });
        await authService.signOut(); // Sign out the user
        return;
      }

      console.log("Login successful:", result.data);
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter your email first" });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.resetPassword(formData.email);
      if (result.success) {
        alert("Password reset email sent! Check your inbox.");
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrors({ submit: "Failed to send reset email" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Sign in to your hospital admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@hospital.com"
                    value={formData.email}
                    onChange={handleChange("email")}
                    className={`pl-10 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    className={`pl-10 pr-10 ${
                      errors.password ? "border-destructive" : ""
                    }`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  disabled={isLoading}
                >
                  Forgot your password?
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an admin account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register your hospital
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
