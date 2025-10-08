import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertTriangle, Lock } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const AdminPasswordConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  adminEmail,
  loading = false,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setError("");
    onConfirm(password);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-yellow-600" />
            Admin Verification Required
          </DialogTitle>
          <DialogDescription>
            For security purposes, please confirm your admin password to
            create a new doctor account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-sm text-yellow-800">
                This action will create a new doctor account with login
                credentials. The doctor will be able to access their dashboard
                immediately.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-gray-600">
                Admin Email
              </Label>
              <Input
                id="admin-email"
                value={adminEmail || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your admin password"
                autoFocus
                required
              />
              {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Confirm & Create Doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordConfirmDialog;