
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import AdminFilterPanel from "@/components/agendamentos/AdminFilterPanel";
import AdminExamsTable from "@/components/agendamentos/AdminExamsTable";
import { format } from "date-fns";

const AdminAgendamentos = () => {
  const { toast } = useToast();
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    moduleFilter: "",
    selectedStatus: "all",
    computerFilter: "all",
    date: undefined as Date | undefined,
  });

  // Consulta os exames no Supabase
  const { data: exams, isLoading, refetch } = useQuery({
    queryKey: ['admin-exams', isFiltering, filters],
    queryFn: async () => {
      console.log("Admin: Fetching exams data with filters:", filters);
      if (!supabase) {
        console.error("Cliente Supabase não inicializado");
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Cliente Supabase não inicializado",
        });
        throw new Error("Cliente Supabase não inicializado");
      }

      let query = supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: true });

      // Apply filters if filtering is active
      if (isFiltering) {
        if (filters.searchTerm) {
          query = query.ilike('student_name', `%${filters.searchTerm}%`);
        }
        
        if (filters.moduleFilter) {
          query = query.ilike('exam_type', `%${filters.moduleFilter}%`);
        }
        
        if (filters.selectedStatus !== "all") {
          query = query.eq('status', filters.selectedStatus);
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
        console.error("Error fetching admin exams:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar agendamentos",
          description: error.message,
        });
        throw error;
      }

      console.log("Admin exams data retrieved:", data);
      return data;
    },
  });

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFiltering(true);
    refetch();
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-8">
        Acompanhamento de Agendamentos
      </h1>

      <AdminFilterPanel onApplyFilters={handleApplyFilters} />
      <AdminExamsTable exams={exams} isLoading={isLoading} />
    </div>
  );
};

export default AdminAgendamentos;
