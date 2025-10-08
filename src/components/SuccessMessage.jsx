import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Hospital, User, Mail, Phone, MapPin } from "lucide-react";

export function SuccessMessage({ adminData, hospitalData, onGoToDashboard }) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <CardTitle className="text-green-800">
            Registration Successful!
          </CardTitle>
          <CardDescription className="text-green-600">
            Your hospital has been successfully registered on the QueueCare
            platform!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Registration Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Admin Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Administrator Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{adminData.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{adminData.email}</span>
            </div>
            <Badge variant="secondary" className="w-fit">
              Hospital Admin
            </Badge>
          </CardContent>
        </Card>

        {/* Hospital Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="w-5 h-5" />
              Hospital Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Hospital className="w-4 h-4 text-muted-foreground" />
              <span>{hospitalData.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{hospitalData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{hospitalData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {hospitalData.city}, {hospitalData.state}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm text-muted-foreground">
                Hospital Registration Number
              </Label>
              <p className="font-mono text-sm bg-muted p-2 rounded">
                {hospitalData.registrationNumber}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Registration Date
              </Label>
              <p className="text-sm bg-muted p-2 rounded">
                {new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button onClick={onGoToDashboard} size="lg" className="px-8">
          Go to Admin Dashboard
        </Button>
      </div>
    </div>
  );
}

function Label({ className, children }) {
  return <label className={className}>{children}</label>;
}
