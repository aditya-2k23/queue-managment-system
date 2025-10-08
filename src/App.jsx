import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { DepartmentsPage } from "./pages/admin/DepartmentsPage";
import { DoctorsPage } from "./pages/admin/DoctorsPage";
import { DoctorLoginPage } from "./pages/doctor/DoctorLoginPage";
import { DoctorDashboardPage } from "./pages/doctor/DoctorDashboardPage";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Doctor Routes */}
        <Route path="/doctor/login" element={<DoctorLoginPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
        <Route
          path="/doctor/dashboard/:doctorId"
          element={<DoctorDashboardPage />}
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/departments" element={<DepartmentsPage />} />
        <Route path="/admin/doctors" element={<DoctorsPage />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}
