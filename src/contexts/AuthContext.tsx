
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

  // Função para sincronizar usuário do Auth com a tabela users
  const syncUserWithDatabase = async (user: User) => {
    if (!supabase) {
      console.error('Tentativa de sincronizar usuário sem cliente Supabase');
      return;
    }

    try {
      console.log('Verificando usuário na tabela users:', user.email);
      // Verifica se o usuário já existe na tabela users
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (selectError) {
        console.error('Erro ao verificar usuário:', selectError);
        return;
      }

      if (!existingUser) {
        // Se não existir, cria um novo registro na tabela users
        console.log('Criando novo usuário na tabela users:', user.email);
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          name: user.email?.split('@')[0] || 'Admin User',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error('Erro ao criar usuário:', insertError);
          toast({
            variant: "destructive",
            title: "Erro ao criar usuário",
            description: insertError.message,
          });
        } else {
          console.log('Usuário criado com sucesso na tabela users');
        }
      } else {
        console.log('Usuário já existe na tabela users');
      }
    } catch (error) {
      console.error('Erro ao sincronizar usuário:', error);
    }
  };

  // Inicialização do AuthProvider e listeners de autenticação
  useEffect(() => {
    if (!supabase) {
      console.error('Cliente Supabase não inicializado no AuthProvider');
      return;
    }

    console.log('Inicializando AuthProvider...');
    
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão atual:', session ? 'Ativa' : 'Inativa');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        syncUserWithDatabase(session.user);
      }
    });

    // Configura listener para mudanças de estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Mudança de estado de autenticação:', _event);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await syncUserWithDatabase(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função de login
  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error('Tentativa de login sem cliente Supabase');
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Sistema não inicializado corretamente",
      });
      return;
    }

    try {
      console.log('Tentando login com email:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        throw error;
      }

      console.log('Login bem-sucedido:', data.user?.email);
      
      if (data.user) {
        await syncUserWithDatabase(data.user);
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a área administrativa.",
      });
      
      navigate("/admin/dashboard");
    } catch (error) {
      console.error('Erro capturado no login:', error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Erro ao fazer login",
      });
    }
  };

  // Função de logout
  const signOut = async () => {
    if (!supabase) {
      console.error('Tentativa de logout sem cliente Supabase');
      return;
    }

    try {
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
