
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

/**
 * Configuração e inicialização do cliente Supabase
 * 
 * Este arquivo configura a conexão com o Supabase usando as variáveis de ambiente
 * e exporta o cliente para ser usado em toda a aplicação.
 */

// Obtém as variáveis de ambiente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas:');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? '✅ configurada' : '❌ faltando');
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ configurada' : '❌ faltando');
  console.warn('Para corrigir este problema, adicione as variáveis de ambiente ao arquivo .env.local ou através do seu provedor de hospedagem.');
}

// Se as credenciais não estiverem configuradas, configuramos com valores temporários
// apenas para a aplicação não quebrar durante o desenvolvimento (deve ser substituído)
const tempUrl = supabaseUrl || 'https://temp-supabase-url.supabase.co';
const tempKey = supabaseAnonKey || 'temp-anon-key';

// Inicializa o cliente Supabase com configurações de autenticação
const supabase = createClient<Database>(tempUrl, tempKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

console.log('✅ Cliente Supabase inicializado');
console.log('⚠️ Importante: Se as variáveis de ambiente estiverem ausentes, a aplicação estará operando em modo temporário.');

export { supabase };
