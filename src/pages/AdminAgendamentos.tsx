
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";

// Tipo para os exames com informações do aluno
type ExamWithStudent = Database['public']['Tables']['exams']['Row'] & {
  users: {
    name: string;
  };
};

const AdminAgendamentos = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [computerFilter, setComputerFilter] = useState("all");

  // Consulta os exames no Supabase
  const { data: exams, isLoading } = useQuery({
    queryKey: ['admin-exams'],
    queryFn: async () => {
      if (!supabase) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Cliente Supabase não inicializado",
        });
        throw new Error("Cliente Supabase não inicializado");
      }

      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          users:student_id (
            name
          )
        `)
        .order('exam_date', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar agendamentos",
          description: error.message,
        });
        throw error;
      }
      
      return data as ExamWithStudent[];
    },
  });

  // Generate array of PCs for the select options
  const computers = Array.from({ length: 14 }, (_, i) => `PC-${String(i + 1).padStart(2, '0')}`);

  const translateStatus = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado";
      case "failed":
        return "Reprovado";
      default:
        return "Pendente";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const filteredExams = exams?.filter((exam) => {
    const matchesSearch = exam.users.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === "" || exam.exam_type
      .toLowerCase()
      .includes(moduleFilter.toLowerCase());
    const matchesStatus = selectedStatus === "all" || exam.status === selectedStatus;
    const matchesComputer = computerFilter === "all" || `PC-${String(exam.computer_number).padStart(2, '0')}` === computerFilter;
    const matchesDate = !date || format(new Date(exam.exam_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    
    return matchesSearch && matchesModule && matchesStatus && matchesComputer && matchesDate;
  });

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-8">
        Acompanhamento de Agendamentos
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <div className="space-y-2">
          <Label>Nome do Aluno</Label>
          <Input
            placeholder="Digite o nome do aluno"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Prova</Label>
          <Input
            placeholder="Digite o tipo da prova"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovado</SelectItem>
              <SelectItem value="failed">Reprovado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Computador</Label>
          <Select value={computerFilter} onValueChange={setComputerFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o computador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {computers.map((pc) => (
                <SelectItem key={pc} value={pc}>
                  {pc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Data</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {date && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDate(undefined)}
              className="mt-2 w-full"
            >
              Limpar Data
            </Button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left font-semibold">Aluno</th>
              <th className="p-3 text-left font-semibold">Tipo</th>
              <th className="p-3 text-left font-semibold">Data</th>
              <th className="p-3 text-left font-semibold">Computador</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Horário</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Carregando agendamentos...
                </td>
              </tr>
            ) : filteredExams && filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <tr
                  key={exam.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">{exam.users.name}</td>
                  <td className="p-3">{exam.exam_type}</td>
                  <td className="p-3">
                    {format(new Date(exam.exam_date), "dd/MM/yyyy")}
                  </td>
                  <td className="p-3">PC-{String(exam.computer_number).padStart(2, '0')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${getStatusColor(exam.status)}`}>
                      {translateStatus(exam.status)}
                    </span>
                  </td>
                  <td className="p-3">{exam.class_time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum agendamento encontrado com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAgendamentos;
