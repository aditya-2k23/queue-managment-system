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
import { AlertTriangle } from "lucide-react";

const AdminPasswordConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  adminEmail,
  loading = false,
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // guard against double submit while parent is creating
    if (!password.trim()) return;
    try {
      await onConfirm(password);
    } catch (err) {
      // onConfirm should handle its own errors, but keep a safety net
      console.error("Admin password confirmation failed:", err);
    } finally {
      // Only clear the password field after attempt so user can retry if it failed
      if (!loading) setPassword("");
    }
  };

  const handleClose = () => {
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Admin Authentication Required
          </DialogTitle>
          <DialogDescription>
            Creating a doctor account will sign you out temporarily. Please
            enter your password to automatically sign back in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={adminEmail}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Your Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your admin password"
              required
              autoFocus
            />
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
            <Button type="submit" disabled={loading || !password.trim()}>
              {loading ? "Creating Doctor..." : "Continue & Create Doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordConfirmDialog;
