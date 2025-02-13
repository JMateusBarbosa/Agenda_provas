
import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto py-8 px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary-gold" />
              <h3 className="text-lg font-semibold">Sobre Nós</h3>
            </div>
            <p className="text-sm text-gray-300">
              Facilitamos o processo de agendamento de provas, oferecendo uma
              plataforma intuitiva e eficiente para instituições educacionais.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary-gold" />
                <span>(11) 4002-8922</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary-gold" />
                <span>contato@sistemaprovas.com.br</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary-gold" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/agendamentos" className="hover:text-primary-gold transition-colors">
                  Agendamentos
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary-gold transition-colors">
                  Área Administrativa
                </Link>
              </li>
              <li>
                <Link to="/suporte" className="hover:text-primary-gold transition-colors">
                  Suporte
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidade" className="hover:text-primary-gold transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-primary-gold/30 pt-4">
          <div className="text-center text-sm">
            <p>© 2024 Sistema de Agendamento de Provas - Todos os direitos reservados</p>
            <p className="text-gray-400 text-xs mt-1">
              Desenvolvido com tecnologia de ponta para garantir a melhor experiência
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
