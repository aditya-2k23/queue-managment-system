import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "./ui/table";
import { Plus, Edit, Trash2, Building2, X } from "lucide-react";
import { departmentService } from "../lib/database";
import { toast } from "sonner";

const emptyForm = { name: "", description: "" };

export default function DepartmentManagement({ hospitalId }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadDepartments = useCallback(async () => {
    if (!hospitalId) return;
    setLoading(true);
    try {
      const res = await departmentService.getDepartmentsByHospital(hospitalId);
      if (res.success) {
        setDepartments(res.data || []);
      } else {
        toast.error(res.error || "Failed to load departments");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error loading departments");
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const openCreate = () => {
    setEditing(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (dept) => {
    setEditing(dept);
    setFormData({ name: dept.name, description: dept.description || "" });
    setFormOpen(true);
  };

  const handleDelete = async (dept) => {
    if (
      !confirm(
        `Delete department "${dept.name}"? Doctors linked to it will show 'N/A' until reassigned.`
      )
    )
      return;
    try {
      const res = await departmentService.deleteDepartment(dept.id);
      if (res.success) {
        toast.success("Department deleted");
        loadDepartments();
      } else toast.error(res.error || "Delete failed");
    } catch (e) {
      console.error(e);
      toast.error("Error deleting department");
    }
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (formData.name.length < 3) return "Name must be at least 3 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await departmentService.updateDepartment(
          editing.id,
          formData
        );
        if (res.success) {
          toast.success("Department updated");
          setFormOpen(false);
          loadDepartments();
        } else toast.error(res.error || "Update failed");
      } else {
        const res = await departmentService.createDepartment(
          formData,
          hospitalId
        );
        if (res.success) {
          toast.success("Department created");
          setFormOpen(false);
          loadDepartments();
        } else toast.error(res.error || "Create failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Departments
          </CardTitle>
          <CardDescription>
            Define hospital departments before adding doctors.
          </CardDescription>
        </div>
        {!formOpen && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> New Department
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 border rounded-lg p-4 space-y-4 bg-muted/30"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm tracking-wide">
                {editing ? "Edit Department" : "Create Department"}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setFormOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Cardiology"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Optional description"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading departments...
          </div>
        ) : departments.length === 0 ? (
          <div className="py-16 text-center">
            <Building2 className="h-14 w-14 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold mb-2">No Departments Yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Create your first department to begin adding doctors.
            </p>
            {!formOpen && (
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" /> Create Department
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableCaption>
              {departments.length} department
              {departments.length !== 1 ? "s" : ""} defined
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell
                    className="max-w-md truncate"
                    title={dept.description}
                  >
                    {dept.description || "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(dept)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(dept)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
