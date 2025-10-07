import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Hospital, MapPin, Phone, Mail, FileText } from "lucide-react";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
];

export function HospitalRegistrationForm({
  onSubmit,
  onBack,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    registrationNumber: "",
    queueType: "token",
    autoAssign: true,
    notifyViaSms: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Hospital name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }
    if (!formData.registrationNumber.trim())
      newErrors.registrationNumber = "Registration number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckboxChange = (field) => (checked) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Hospital className="w-5 h-5" />
          Register Your Hospital
        </CardTitle>
        <CardDescription>
          Register your hospital on QueueCare so patients can discover your
          services and join virtual queues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital Name *</Label>
                <Input
                  id="hospitalName"
                  placeholder="ABC General Hospital"
                  value={formData.name}
                  onChange={handleChange("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalEmail">Hospital Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="hospitalEmail"
                    type="email"
                    placeholder="info@hospital.com"
                    value={formData.email}
                    onChange={handleChange("email")}
                    className={`pl-10 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    className={`pl-10 ${
                      errors.phone ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">
                  Registration Number *
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="registrationNumber"
                    placeholder="REG/2024/001"
                    value={formData.registrationNumber}
                    onChange={handleChange("registrationNumber")}
                    className={`pl-10 ${
                      errors.registrationNumber ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.registrationNumber && (
                  <p className="text-sm text-destructive">
                    {errors.registrationNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">
              Address Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="address">Complete Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  placeholder="123, Hospital Street, Medical District"
                  value={formData.address}
                  onChange={handleChange("address")}
                  className={`pl-10 min-h-[80px] ${
                    errors.address ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleChange("city")}
                  className={errors.city ? "border-destructive" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select
                  value={formData.state}
                  onValueChange={handleSelectChange("state")}
                >
                  <SelectTrigger
                    className={errors.state ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  placeholder="400001"
                  value={formData.pincode}
                  onChange={handleChange("pincode")}
                  className={errors.pincode ? "border-destructive" : ""}
                />
                {errors.pincode && (
                  <p className="text-sm text-destructive">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">
              System Settings
            </h3>

            <div className="space-y-2">
              <Label htmlFor="queueType">Queue Management Type</Label>
              <Select
                value={formData.queueType}
                onValueChange={handleSelectChange("queueType")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="token">Token Based</SelectItem>
                  <SelectItem value="time-slot">Time Slot Based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoAssign"
                  checked={formData.autoAssign}
                  onCheckedChange={handleCheckboxChange("autoAssign")}
                />
                <Label htmlFor="autoAssign" className="text-sm">
                  Auto-assign patients to available doctors
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifyViaSms"
                  checked={formData.notifyViaSms}
                  onCheckedChange={handleCheckboxChange("notifyViaSms")}
                />
                <Label htmlFor="notifyViaSms" className="text-sm">
                  Send SMS notifications to patients
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Registering..." : "Complete Registration"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
