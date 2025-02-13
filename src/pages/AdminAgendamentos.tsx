
import { useState } from "react";
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

const AdminAgendamentos = () => {
  const [date, setDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [computerFilter, setComputerFilter] = useState("all");

  // Generate array of PCs for the select options
  const computers = Array.from({ length: 14 }, (_, i) => `PC-${String(i + 1).padStart(2, '0')}`);

  // Mock data - replace with actual data from your backend
  const exams = [
    {
      id: 1,
      studentName: "João Silva",
      moduleName: "JavaScript Básico",
      examDate: "2024-03-20",
      computerNumber: "PC-05",
      status: "Pendente",
      classTime: "8:30 - 9:30",
    },
    // Add more mock data as needed
  ];

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.studentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === "" || exam.moduleName
      .toLowerCase()
      .includes(moduleFilter.toLowerCase());
    const matchesStatus = selectedStatus === "all" || exam.status === selectedStatus;
    const matchesComputer = computerFilter === "all" || exam.computerNumber === computerFilter;
    const matchesDate =
      !date ||
      format(new Date(exam.examDate), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd");
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
          <Label>Nome do Módulo</Label>
          <Input
            placeholder="Digite o nome do módulo"
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
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Aprovado">Aprovado</SelectItem>
              <SelectItem value="Reprovado">Reprovado</SelectItem>
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
              <th className="p-3 text-left font-semibold">Módulo</th>
              <th className="p-3 text-left font-semibold">Data</th>
              <th className="p-3 text-left font-semibold">Computador</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Horário</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr
                key={exam.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="p-3">{exam.studentName}</td>
                <td className="p-3">{exam.moduleName}</td>
                <td className="p-3">
                  {format(new Date(exam.examDate), "dd/MM/yyyy")}
                </td>
                <td className="p-3">{exam.computerNumber}</td>
                <td className="p-3">{exam.status}</td>
                <td className="p-3">{exam.classTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum agendamento encontrado com os filtros selecionados.
        </div>
      )}
    </div>
  );
};

export default AdminAgendamentos;
