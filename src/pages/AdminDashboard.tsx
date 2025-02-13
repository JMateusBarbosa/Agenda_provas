
import { Navigate, useLocation, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  const location = useLocation();
  
  // Redirect to agendar if accessing the dashboard root
  if (location.pathname === "/admin/dashboard") {
    return <Navigate to="/admin/dashboard/agendar" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col p-4 mt-24 mb-12">
        <div className="w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
