import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Main content with subtle background pattern */}
      <main className="flex-grow pt-16 bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:20px_20px] [background-position:center] [background-opacity:0.1]">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mt-8 p-8 bg-primary-yellow rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-primary text-center mb-6">
              Facilidade e Organização no Agendamento de Provas
            </h1>
            
            <p className="text-lg text-gray-700 text-center mb-8">
              Com nosso sistema, você pode visualizar e agendar provas de forma rápida e eficiente. 
              Consulte os agendamentos e faça reservas sem complicação.
            </p>
            
            <div className="text-center">
              <a
                href="/agendamentos"
                className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg 
                         transform transition-all duration-200 
                         hover:bg-primary-gold hover:text-primary 
                         hover:scale-105 focus:outline-none focus:ring-2 
                         focus:ring-primary-gold focus:ring-opacity-50"
              >
                Ver Agendamentos
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;