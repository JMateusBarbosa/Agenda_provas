
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Obtém as variáveis de ambiente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas:');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? '✅ configurada' : '❌ faltando');
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ configurada' : '❌ faltando');
}

// Inicializa o cliente Supabase com configurações de autenticação
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

if (supabase) {
  console.log('✅ Cliente Supabase inicializado com sucesso');
} else {
  console.warn('⚠️ Cliente Supabase não inicializado - algumas funcionalidades podem não estar disponíveis');
}

export { supabase };
