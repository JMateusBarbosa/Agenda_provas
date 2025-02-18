
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!supabase) {
          console.error('Cliente Supabase não inicializado');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        console.log('Sessão atual:', session ? 'Ativa' : 'Inativa');
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      }
    };

    checkSession();

    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Mudança de estado de autenticação:', _event);
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        throw new Error('Sistema não inicializado corretamente');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a área administrativa.",
      });

      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    }
  };

  const signOut = async () => {
    try {
      if (!supabase) {
        throw new Error('Sistema não inicializado corretamente');
      }

      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Logout realizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
