
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const AgendarProva = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    nomeAluno: "",
    examDate: new Date(),
    computerNumber: "",
    shift: "",
    classTime: "",
    examType: "P1" as "P1" | "Rec.1" | "Rec.2",
  });

  // Query para buscar exames recentes
  const { data: recentExams, isLoading: loadingExams } = useQuery({
    queryKey: ['recent-exams'],
    queryFn: async () => {
      if (!supabase) throw new Error("Cliente Supabase não inicializado");
      
      const { data, error } = await supabase
        .from('exams')
        .select(`
          id,
          student_name,
          exam_type,
          exam_date,
          computer_number,
          shift,
          class_time,
          users (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  // Mutation para criar novo agendamento
  const createExamMutation = useMutation({
    mutationFn: async (examData: typeof formData) => {
      if (!supabase) throw new Error("Cliente Supabase não inicializado");
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('exams')
        .insert({
          student_name: examData.nomeAluno,
          exam_date: examData.examDate.toISOString(),
          computer_number: parseInt(examData.computerNumber),
          shift: examData.shift,
          class_time: examData.classTime,
          exam_type: examData.examType,
          created_by: user.id,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-exams'] });
      toast({
        title: "Agendamento realizado",
        description: "A prova foi agendada com sucesso!",
      });
      setFormData({
        nomeAluno: "",
        examDate: new Date(),
        computerNumber: "",
        shift: "",
        classTime: "",
        examType: "P1",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao agendar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExamMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Agendamento de Provas
        </h1>
        <p className="text-gray-600">
          Cadastre novas provas preenchendo os campos abaixo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome do Aluno */}
          <div className="space-y-2">
            <Label htmlFor="nomeAluno">Nome do Aluno</Label>
            <Input
              id="nomeAluno"
              value={formData.nomeAluno}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, nomeAluno: e.target.value }))
              }
              placeholder="Digite o nome do aluno"
              required
            />
          </div>

          {/* Exam Type */}
          <div className="space-y-2">
            <Label htmlFor="examType">Tipo da Prova</Label>
            <Select
              value={formData.examType}
              onValueChange={(value: "P1" | "Rec.1" | "Rec.2") => 
                setFormData(prev => ({ ...prev, examType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P1">P1</SelectItem>
                <SelectItem value="Rec.1">Rec.1</SelectItem>
                <SelectItem value="Rec.2">Rec.2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exam Date */}
          <div className="space-y-2">
            <Label>Data da Prova</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.examDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.examDate ? (
                    format(formData.examDate, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.examDate}
                  onSelect={(date) =>
                    setFormData(prev => ({ ...prev, examDate: date || new Date() }))
                  }
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Computer Number */}
          <div className="space-y-2">
            <Label htmlFor="computerNumber">Número do Computador</Label>
            <Select
              value={formData.computerNumber}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, computerNumber: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o computador" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Computador {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shift */}
          <div className="space-y-2">
            <Label htmlFor="shift">Turno</Label>
            <Select
              value={formData.shift}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, shift: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Manhã</SelectItem>
                <SelectItem value="afternoon">Tarde</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Class Time */}
          <div className="space-y-2">
            <Label htmlFor="classTime">Horário da Aula</Label>
            <Select
              value={formData.classTime}
              onValueChange={(value) =>
                setFormData(prev => ({ ...prev, classTime: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="07:30 - 08:30">Segunda a Quinta - 7:30 - 8:30</SelectItem>
                <SelectItem value="08:30 - 09:30">Segunda a Quinta - 8:30 - 9:30</SelectItem>
                <SelectItem value="09:30 - 10:30">Segunda a Quinta - 9:30 - 10:30</SelectItem>
                <SelectItem value="14:00 - 15:00">Segunda a Quinta - 14:00 - 15:00</SelectItem>
                <SelectItem value="15:00 - 16:00">Segunda a Quinta - 15:00 - 16:00</SelectItem>
                <SelectItem value="16:00 - 17:00">Segunda a Quinta - 16:00 - 17:00</SelectItem>
                <SelectItem value="17:00 - 18:00">Segunda a Quinta - 17:00 - 18:00</SelectItem>
                <SelectItem value="18:00 - 19:00">Segunda a Quinta - 18:00 - 19:00</SelectItem>
                <SelectItem value="07:30 - 09:30">Sábado - 7:30 - 9:30</SelectItem>
                <SelectItem value="09:30 - 11:30">Sábado - 9:30 - 11:30</SelectItem>
                <SelectItem value="14:00 - 16:00">Sábado - 14:00 - 16:00</SelectItem>
                <SelectItem value="16:00 - 18:00">Sábado - 16:00 - 18:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            type="submit"
            className="bg-primary text-white hover:bg-primary-gold transition-colors duration-200"
            disabled={createExamMutation.isPending}
          >
            {createExamMutation.isPending ? "Salvando..." : "Salvar Agendamento"}
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/admin/dashboard/resultados")}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            Ver Provas Pendentes
          </Button>
        </div>
      </form>

      {/* Recent Appointments Table */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Provas Agendadas Recentemente
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Aluno</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Computador</th>
                <th className="p-3 text-left">Turno</th>
                <th className="p-3 text-left">Horário</th>
              </tr>
            </thead>
            <tbody>
              {loadingExams ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Carregando agendamentos recentes...
                  </td>
                </tr>
              ) : recentExams && recentExams.length > 0 ? (
                recentExams.map((exam) => (
                  <tr
                    key={exam.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{exam.student_name}</td>
                    <td className="p-3">{exam.exam_type}</td>
                    <td className="p-3">{format(new Date(exam.exam_date), "dd/MM/yyyy")}</td>
                    <td className="p-3">PC-{String(exam.computer_number).padStart(2, '0')}</td>
                    <td className="p-3">{exam.shift === 'morning' ? 'Manhã' : 'Tarde'}</td>
                    <td className="p-3">{exam.class_time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhum agendamento recente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgendarProva;
