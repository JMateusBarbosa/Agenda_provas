
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

      let query = supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: true });

      // Apply filters if filtering is active
      if (isFiltering) {
        if (filters.studentFilter) {
          query = query.ilike('student_name', `%${filters.studentFilter}%`);
        }
        
        if (filters.statusFilter !== "all") {
          query = query.eq('status', filters.statusFilter);
        }
        
        if (filters.computerFilter !== "all") {
          const computerNumber = parseInt(filters.computerFilter.replace('PC-', ''));
          if (!isNaN(computerNumber)) {
            query = query.eq('computer_number', computerNumber);
          }
        }
        
        if (filters.date) {
          const dateStr = format(filters.date, "yyyy-MM-dd");
          query = query.gte('exam_date', `${dateStr}T00:00:00Z`)
                       .lt('exam_date', `${dateStr}T23:59:59Z`);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching exams:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar agendamentos",
          description: error.message,
        });
        throw error;
      }

      console.log("Exams data retrieved:", data);
      return data;
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
