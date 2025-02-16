
import { useState } from "react";
import { Menu, X, GraduationCap, LogOut, User } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const getNavItems = () => {
    // Admin dashboard navigation
    if (location.pathname.startsWith("/admin/dashboard")) {
      return [
        { 
          name: "Agendamentos", 
          href: "/admin/dashboard/agendamentos", 
          active: location.pathname === "/admin/dashboard/agendamentos" 
        },
        { 
          name: "Agendar Prova", 
          href: "/admin/dashboard/agendar", 
          active: location.pathname === "/admin/dashboard/agendar" 
        },
        { 
          name: "Registro de Resultados", 
          href: "/admin/dashboard/resultados", 
          active: location.pathname === "/admin/dashboard/resultados" 
        },
      ];
    }
    
    // Admin login page navigation
    if (location.pathname.startsWith("/admin")) {
      return [
        { name: "Página Inicial", href: "/", active: location.pathname === "/" },
      ];
    }

    // Default navigation for public pages
    return [
      { name: "Página Inicial", href: "/", active: location.pathname === "/" },
      {
        name: "Agendamentos",
        href: "/agendamentos",
        active: location.pathname === "/agendamentos",
      },
      { 
        name: "Área Administrativa", 
        href: "/admin", 
        active: location.pathname.startsWith("/admin")
      },
    ];
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navItems = getNavItems();
  const isAdminDashboard = location.pathname.startsWith("/admin/dashboard");

  return (
    <nav className="fixed top-0 w-full bg-primary z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <GraduationCap className="h-8 w-8 text-primary-gold" />
            </div>
            <span className="text-white text-xl font-bold hidden sm:block">
              Sistema de Agendamento de Provas
            </span>
            <span className="text-white text-lg font-bold sm:hidden">
              Sistema de Provas
            </span>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAdminDashboard && (
              <div className="text-white flex items-center mr-4">
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm">{user?.email?.split('@')[0]}</span>
              </div>
            )}
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    item.active
                      ? "bg-primary-gold text-primary"
                      : "text-white hover:bg-primary-gold hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAdminDashboard && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-gold hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Link>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-gold hover:text-primary focus:outline-none"
              aria-expanded="false"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAdminDashboard && (
              <div className="text-white flex items-center px-3 py-2">
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm">{user?.email?.split('@')[0]}</span>
              </div>
            )}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.active
                    ? "bg-primary-gold text-primary"
                    : "text-white hover:bg-primary-gold hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAdminDashboard && (
              <Link
                to="/admin"
                onClick={handleLinkClick}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-gold hover:text-primary flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
