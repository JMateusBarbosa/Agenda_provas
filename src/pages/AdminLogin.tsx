
import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    // Mock login validation
    if (email === "admin@gmail.com" && password === "admin") {
      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a área administrativa.",
      });
      navigate("/admin/dashboard");
    } else {
      setError(true);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "E-mail ou senha incorretos. Tente novamente.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 mt-24 mb-12">
        <div className="w-full max-w-md bg-primary-yellow rounded-lg p-8 shadow-lg animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">
              Área Administrativa
            </h1>
            <p className="text-gray-600">Faça login para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">
                E-mail ou senha incorretos. Tente novamente.
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary-gold hover:bg-primary hover:text-white text-primary transition-colors"
            >
              Entrar
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Para teste, use:</p>
            <p>Email: admin@gmail.com</p>
            <p>Senha: admin</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
