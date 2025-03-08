
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import AdminFilterPanel from "@/components/agendamentos/AdminFilterPanel";
import AdminExamsTable from "@/components/agendamentos/AdminExamsTable";

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
        throw new Error("Cliente Supabase não inicializado");
      }
      
      try {
        let query = supabase
          .from('exams')
          .select('*');
        
        // Aplicar filtros na consulta Supabase quando possível
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
          const filterDate = new Date(filters.date);
          // Converter para string ISO sem horas
          const dateStr = filterDate.toISOString().split('T')[0];
          query = query.ilike('exam_date', `${dateStr}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching admin exams:", error);
          throw new Error(error.message || "Erro ao buscar agendamentos");
        }

        console.log("Raw admin exams data:", data);
        
        // Ordenar por data (mais recente primeiro)
        let filteredData = data.sort((a: any, b: any) => 
          new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
        );

        // Aplicar filtros adicionais no cliente
        if (isFiltering) {
          filteredData = filteredData.filter((exam: any) => {
            // Filtro por nome do aluno
            if (filters.searchTerm && !exam.student_name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
              return false;
            }
            
            // Filtro por tipo de módulo (exam_type)
            if (filters.moduleFilter && !exam.exam_type.toLowerCase().includes(filters.moduleFilter.toLowerCase())) {
              return false;
            }
            
            return true;
          });
        }

        console.log("Filtered admin exams data:", filteredData);
        return filteredData;
      } catch (error: any) {
        console.error("Error fetching admin exams:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar agendamentos",
          description: error.message || "Falha ao buscar dados",
        });
        throw error;
      }
    },
    refetchInterval: 60000, // Refetch every minute
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
