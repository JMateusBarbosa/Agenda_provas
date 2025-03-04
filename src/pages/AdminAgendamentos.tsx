
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
      
      try {
        // Usar o fetch nativo para buscar os dados
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
          console.error("Error fetching admin exams:", errorData);
          throw new Error(errorData.message || "Erro ao buscar agendamentos");
        }

        let data = await response.json();
        console.log("Raw admin exams data:", data);
        
        // Ordenar por data (mais recente primeiro)
        data = data.sort((a: any, b: any) => 
          new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
        );

        // Aplicar filtros manualmente no frontend
        if (isFiltering) {
          data = data.filter((exam: any) => {
            // Filtro por nome do aluno
            if (filters.searchTerm && !exam.student_name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
              return false;
            }
            
            // Filtro por tipo de módulo (exam_type)
            if (filters.moduleFilter && !exam.exam_type.toLowerCase().includes(filters.moduleFilter.toLowerCase())) {
              return false;
            }
            
            // Filtro por status
            if (filters.selectedStatus !== "all" && exam.status !== filters.selectedStatus) {
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

        console.log("Filtered admin exams data:", data);
        return data;
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
