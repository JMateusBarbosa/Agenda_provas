
import { useState } from "react";
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

// Mock data for demonstration
const mockData = [
  {
    id: 1,
    aluno: "João Silva",
    modulo: "Matemática Básica",
    data: "2024-03-20",
    horario: "14:00",
    tipo: "P1",
    status: "Pendente",
    computador: "PC-01",
  },
  {
    id: 2,
    aluno: "Maria Santos",
    modulo: "Português Avançado",
    data: "2024-03-19",
    horario: "15:30",
    tipo: "Rec.1",
    status: "Aprovado",
    computador: "PC-05",
  },
  {
    id: 3,
    aluno: "Pedro Oliveira",
    modulo: "Física Quântica",
    data: "2024-03-21",
    horario: "09:00",
    tipo: "P1",
    status: "Reprovado",
    computador: "PC-12",
  },
];

const Agendamentos = () => {
  const [studentFilter, setStudentFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [computerFilter, setComputerFilter] = useState("all");
  const [date, setDate] = useState<Date>();

  // Generate array of PCs for the select options
  const computers = Array.from({ length: 14 }, (_, i) => `PC-${String(i + 1).padStart(2, '0')}`);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
        return "text-green-600";
      case "reprovado":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const filteredData = mockData.filter((item) => {
    const matchesStudent = item.aluno.toLowerCase().includes(studentFilter.toLowerCase());
    const matchesModule = item.modulo.toLowerCase().includes(moduleFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesComputer = computerFilter === "all" || item.computador === computerFilter;
    const matchesDate = !date || format(new Date(item.data), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
    
    return matchesStudent && matchesModule && matchesStatus && matchesComputer && matchesDate;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-2">
            <Label>Nome do Aluno</Label>
            <Input
              placeholder="Digite o nome do aluno"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary/90">
                <TableHead className="text-white font-semibold">Aluno</TableHead>
                <TableHead className="text-white font-semibold">Módulo</TableHead>
                <TableHead className="text-white font-semibold">Data</TableHead>
                <TableHead className="text-white font-semibold">Horário</TableHead>
                <TableHead className="text-white font-semibold">Tipo</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Computador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <TableCell>{row.aluno}</TableCell>
                  <TableCell>{row.modulo}</TableCell>
                  <TableCell>
                    {format(new Date(row.data), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{row.horario}</TableCell>
                  <TableCell>{row.tipo}</TableCell>
                  <TableCell className={getStatusColor(row.status)}>
                    {row.status}
                  </TableCell>
                  <TableCell>{row.computador}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum agendamento encontrado com os filtros selecionados.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Agendamentos;
