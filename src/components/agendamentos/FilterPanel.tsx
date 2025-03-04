
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Filter } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FilterPanelProps {
  onApplyFilters: (filters: {
    studentFilter: string;
    statusFilter: string;
    computerFilter: string;
    date?: Date;
  }) => void;
}

const FilterPanel = ({ onApplyFilters }: FilterPanelProps) => {
  const { toast } = useToast();
  const [studentFilter, setStudentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [computerFilter, setComputerFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Generate array of PCs for the select options
  const computers = Array.from({ length: 14 }, (_, i) => `PC-${String(i + 1).padStart(2, '0')}`);

  const applyFilters = () => {
    onApplyFilters({
      studentFilter,
      statusFilter,
      computerFilter,
      date,
    });
    
    toast({
      title: "Filtros aplicados",
      description: "Os resultados foram atualizados conforme os filtros.",
    });
  };

  const clearFilters = () => {
    setStudentFilter("");
    setStatusFilter("all");
    setComputerFilter("all");
    setDate(undefined);
    
    onApplyFilters({
      studentFilter: "",
      statusFilter: "all",
      computerFilter: "all",
      date: undefined,
    });
    
    toast({
      title: "Filtros limpos",
      description: "Mostrando todos os agendamentos.",
    });
  };

  return (
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

      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4">
        <Button 
          onClick={applyFilters}
          className="w-full md:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          Aplicar Filtros
        </Button>
        <Button 
          onClick={clearFilters}
          variant="outline"
          className="w-full md:w-auto"
        >
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
