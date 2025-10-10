import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const AdminDashboardHeader = ({ hospitalName }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="px-6 md:px-8 py-4 md:py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              {hospitalName}
            </h1>
            <p className="text-xs md:text-sm text-gray-600">
              Administration Dashboard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            onClick={() => navigate("/admin/login")}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 transition-all"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
