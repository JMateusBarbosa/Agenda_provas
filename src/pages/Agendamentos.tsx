
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import FilterPanel from "@/components/agendamentos/FilterPanel";
import ExamsTable from "@/components/agendamentos/ExamsTable";
import { format } from "date-fns";

const Agendamentos = () => {
  const { toast } = useToast();
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    studentFilter: "",
    statusFilter: "all",
    computerFilter: "all",
    date: undefined as Date | undefined,
  });

  // Consulta os exames no Supabase
  const { data: exams, isLoading, refetch } = useQuery({
    queryKey: ['exams', isFiltering, filters],
    queryFn: async () => {
      console.log("Fetching exams data with filters:", filters);
      if (!supabase) {
        console.error("Cliente Supabase não inicializado");
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: "Não foi possível conectar ao banco de dados.",
        });
        throw new Error("Cliente Supabase não inicializado");
      }

      try {
        // Direto ao endpoint REST para evitar políticas RLS recursivas
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/exams?select=*`,
          {
            method: 'GET',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching exams:", errorData);
          throw new Error(errorData.message || "Erro ao buscar agendamentos");
        }

        let data = await response.json();
        
        // Ordenar por data (mais recente primeiro)
        data = data.sort((a: any, b: any) => 
          new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
        );

        // Aplicar filtros manualmente no frontend
        if (isFiltering) {
          data = data.filter((exam: any) => {
            // Filtro por nome do aluno
            if (filters.studentFilter && !exam.student_name.toLowerCase().includes(filters.studentFilter.toLowerCase())) {
              return false;
            }
            
            // Filtro por status
            if (filters.statusFilter !== "all" && exam.status !== filters.statusFilter) {
              return false;
            }
            
            // Filtro por computador
            if (filters.computerFilter !== "all") {
              const computerNumber = parseInt(filters.computerFilter.replace('PC-', ''));
              if (!isNaN(computerNumber) && exam.computer_number !== computerNumber) {
                return false;
              }
            }
            
            // Filtro por data
            if (filters.date) {
              const examDate = new Date(exam.exam_date);
              const filterDate = new Date(filters.date);
              
              // Comparar apenas ano, mês e dia
              if (
                examDate.getFullYear() !== filterDate.getFullYear() ||
                examDate.getMonth() !== filterDate.getMonth() ||
                examDate.getDate() !== filterDate.getDate()
              ) {
                return false;
              }
            }
            
            return true;
          });
        }

        console.log("Exams data retrieved:", data);
        return data;
      } catch (error: any) {
        console.error("Error fetching exams:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar agendamentos",
          description: error.message || "Falha ao buscar dados",
        });
        throw error;
      }
    },
  });

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFiltering(true);
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <FilterPanel onApplyFilters={handleApplyFilters} />
        <ExamsTable exams={exams} isLoading={isLoading} />
      </main>
      <Footer />
    </div>
  );
};

export default Agendamentos;
