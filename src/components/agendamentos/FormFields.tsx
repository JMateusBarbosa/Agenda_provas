
import React from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormData } from "@/types/agendamento";

interface FormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

/**
 * Componente com os campos do formulário de agendamento
 * Gerencia a renderização e atualização dos campos do formulário
 */
const FormFields = ({ formData, setFormData }: FormFieldsProps) => {
  return (
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
            <SelectGroup>
              <SelectLabel>Segunda a Quinta</SelectLabel>
              <SelectItem value="Segunda a Quinta - Manhã - 07:30 - 08:30">Manhã - 7:30 - 8:30</SelectItem>
              <SelectItem value="Segunda a Quinta - Manhã - 08:30 - 09:30">Manhã - 8:30 - 9:30</SelectItem>
              <SelectItem value="Segunda a Quinta - Manhã - 09:30 - 10:30">Manhã - 9:30 - 10:30</SelectItem>
              <SelectItem value="Segunda a Quinta - Tarde - 14:00 - 15:00">Tarde - 14:00 - 15:00</SelectItem>
              <SelectItem value="Segunda a Quinta - Tarde - 15:00 - 16:00">Tarde - 15:00 - 16:00</SelectItem>
              <SelectItem value="Segunda a Quinta - Tarde - 16:00 - 17:00">Tarde - 16:00 - 17:00</SelectItem>
              <SelectItem value="Segunda a Quinta - Tarde - 17:00 - 18:00">Tarde - 17:00 - 18:00</SelectItem>
              <SelectItem value="Segunda a Quinta - Tarde - 18:00 - 19:00">Tarde - 18:00 - 19:00</SelectItem>
            </SelectGroup>
            
            <SelectGroup>
              <SelectLabel>Segunda e Quarta</SelectLabel>
              <SelectItem value="Segunda e Quarta - Manhã - 07:30 - 08:30">Manhã - 7:30 - 8:30</SelectItem>
              <SelectItem value="Segunda e Quarta - Manhã - 08:30 - 09:30">Manhã - 8:30 - 9:30</SelectItem>
              <SelectItem value="Segunda e Quarta - Manhã - 09:30 - 10:30">Manhã - 9:30 - 10:30</SelectItem>
              <SelectItem value="Segunda e Quarta - Tarde - 14:00 - 15:00">Tarde - 14:00 - 15:00</SelectItem>
              <SelectItem value="Segunda e Quarta - Tarde - 15:00 - 16:00">Tarde - 15:00 - 16:00</SelectItem>
              <SelectItem value="Segunda e Quarta - Tarde - 16:00 - 17:00">Tarde - 16:00 - 17:00</SelectItem>
              <SelectItem value="Segunda e Quarta - Tarde - 17:00 - 18:00">Tarde - 17:00 - 18:00</SelectItem>
              <SelectItem value="Segunda e Quarta - Tarde - 18:00 - 19:00">Tarde - 18:00 - 19:00</SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Terça e Quinta</SelectLabel>
              <SelectItem value="Terça e Quinta - Manhã - 07:30 - 08:30">Manhã - 7:30 - 8:30</SelectItem>
              <SelectItem value="Terça e Quinta - Manhã - 08:30 - 09:30">Manhã - 8:30 - 9:30</SelectItem>
              <SelectItem value="Terça e Quinta - Manhã - 09:30 - 10:30">Manhã - 9:30 - 10:30</SelectItem>
              <SelectItem value="Terça e Quinta - Tarde - 14:00 - 15:00">Tarde - 14:00 - 15:00</SelectItem>
              <SelectItem value="Terça e Quinta - Tarde - 15:00 - 16:00">Tarde - 15:00 - 16:00</SelectItem>
              <SelectItem value="Terça e Quinta - Tarde - 16:00 - 17:00">Tarde - 16:00 - 17:00</SelectItem>
              <SelectItem value="Terça e Quinta - Tarde - 17:00 - 18:00">Tarde - 17:00 - 18:00</SelectItem>
              <SelectItem value="Terça e Quinta - Tarde - 18:00 - 19:00">Tarde - 18:00 - 19:00</SelectItem>
            </SelectGroup>

            <SelectGroup>
              <SelectLabel>Sábado</SelectLabel>
              <SelectItem value="Sábado - Manhã - 07:30 - 09:30">Manhã - 7:30 - 9:30</SelectItem>
              <SelectItem value="Sábado - Manhã - 09:30 - 11:30">Manhã - 9:30 - 11:30</SelectItem>
              <SelectItem value="Sábado - Tarde - 14:00 - 16:00">Tarde - 14:00 - 16:00</SelectItem>
              <SelectItem value="Sábado - Tarde - 16:00 - 18:00">Tarde - 16:00 - 18:00</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FormFields;
