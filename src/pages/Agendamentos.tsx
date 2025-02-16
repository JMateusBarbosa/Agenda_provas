
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

// Tipo para os exames com informações do aluno
type ExamWithStudent = Database['public']['Tables']['exams']['Row'] & {
  users: {
    name: string;
  };
};

const Agendamentos = () => {
  const [studentFilter, setStudentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [computerFilter, setComputerFilter] = useState("all");
  const [date, setDate] = useState<Date>();

  // Consulta os exames no Supabase
  const { data: exams, isLoading } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      if (!supabase) throw new Error("Cliente Supabase não inicializado");

      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          users:student_id (
            name
          )
        `)
        .order('exam_date', { ascending: true });

      if (error) throw error;
      return data as ExamWithStudent[];
    },
  });

  // Generate array of PCs for the select options
  const computers = Array.from({ length: 14 }, (_, i) => `PC-${String(i + 1).padStart(2, '0')}`);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

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

  const filteredExams = exams?.filter((exam) => {
    const matchesStudent = exam.users.name.toLowerCase().includes(studentFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
    const matchesComputer = computerFilter === "all" || `PC-${String(exam.computer_number).padStart(2, '0')}` === computerFilter;
    const matchesDate = !date || format(new Date(exam.exam_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    
    return matchesStudent && matchesStatus && matchesComputer && matchesDate;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-2">
            <Label>Nome do Aluno</Label>
            <Input
              placeholder="Digite o nome do aluno"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary/90">
                <TableHead className="text-white font-semibold">Aluno</TableHead>
                <TableHead className="text-white font-semibold">Data</TableHead>
                <TableHead className="text-white font-semibold">Horário</TableHead>
                <TableHead className="text-white font-semibold">Tipo</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Computador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Carregando agendamentos...
                  </TableCell>
                </TableRow>
              ) : filteredExams && filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <TableRow
                    key={exam.id}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <TableCell>{exam.users.name}</TableCell>
                    <TableCell>
                      {format(new Date(exam.exam_date), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{exam.class_time}</TableCell>
                    <TableCell>{exam.exam_type}</TableCell>
                    <TableCell className={getStatusColor(exam.status)}>
                      {translateStatus(exam.status)}
                    </TableCell>
                    <TableCell>PC-{String(exam.computer_number).padStart(2, '0')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    Nenhum agendamento encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Agendamentos;
