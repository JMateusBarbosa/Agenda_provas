
import { Navigate, useLocation, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const location = useLocation();
  const { user, session, isAdmin } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Consideramos o usuário autenticado se temos um usuário/sessão 
    // ou se foi detectado como admin (mesmo com erro de RLS)
    setIsAuthenticated(!!user || !!session || isAdmin);
  }, [user, session, isAdmin]);

  // Aguardar a verificação de autenticação
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  // Redirecionar para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  // Redirecionar para agendar se acessar a raiz do dashboard
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
