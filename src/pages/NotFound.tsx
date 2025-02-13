import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:20px_20px] [background-position:center] [background-opacity:0.1]">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! Página não encontrada</p>
          <a
            href="/"
            className="text-primary hover:text-primary-gold transition-colors duration-200 underline"
          >
            Voltar para Página Inicial
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;