
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

const AgendarProva = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    moduleName: "",
    examDate: "",
    computerNumber: "",
    shift: "",
    classTime: "",
  });

  // Mock data for recent appointments
  const recentAppointments = [
    {
      id: 1,
      studentName: "João Silva",
      moduleName: "JavaScript Básico",
      examDate: "2024-03-20",
      computerNumber: "5",
      shift: "Manhã",
      classTime: "8:30 - 9:30",
    },
    // ... add more mock data if needed
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Agendamento de Provas
        </h1>
        <p className="text-gray-600">
          Cadastre novas provas preenchendo os campos abaixo.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Name */}
          <div className="space-y-2">
            <Label htmlFor="studentName">Nome do Aluno</Label>
            <Input
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              placeholder="Digite o nome do aluno"
            />
          </div>

          {/* Module Name */}
          <div className="space-y-2">
            <Label htmlFor="moduleName">Nome do Módulo</Label>
            <Input
              id="moduleName"
              name="moduleName"
              value={formData.moduleName}
              onChange={handleInputChange}
              placeholder="Digite o nome do módulo"
            />
          </div>

          {/* Exam Date */}
          <div className="space-y-2">
            <Label htmlFor="examDate">Data da Prova</Label>
            <div className="relative">
              <Input
                id="examDate"
                name="examDate"
                type="date"
                value={formData.examDate}
                onChange={handleInputChange}
                className="w-full"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Computer Number */}
          <div className="space-y-2">
            <Label htmlFor="computerNumber">Número do Computador</Label>
            <Select
              name="computerNumber"
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "computerNumber", value },
                } as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o computador" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 14 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    Computador {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Shift */}
          <div className="space-y-2">
            <Label htmlFor="shift">Turno</Label>
            <Select
              name="shift"
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "shift", value },
                } as any)
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
              name="classTime"
              onValueChange={(value) =>
                handleInputChange({
                  target: { name: "classTime", value },
                } as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="morning-1">Segunda a Quinta - 7:30 - 8:30</SelectItem>
                <SelectItem value="morning-2">Segunda a Quinta - 8:30 - 9:30</SelectItem>
                <SelectItem value="morning-3">Segunda a Quinta - 9:30 - 10:30</SelectItem>
                <SelectItem value="afternoon-1">Segunda a Quinta - 14:00 - 15:00</SelectItem>
                <SelectItem value="afternoon-2">Segunda a Quinta - 15:00 - 16:00</SelectItem>
                <SelectItem value="afternoon-3">Segunda a Quinta - 16:00 - 17:00</SelectItem>
                <SelectItem value="afternoon-4">Segunda a Quinta - 17:00 - 18:00</SelectItem>
                <SelectItem value="afternoon-5">Segunda a Quinta - 18:00 - 19:00</SelectItem>
                <SelectItem value="saturday-morning-1">Sábado - 7:30 - 9:30</SelectItem>
                <SelectItem value="saturday-morning-2">Sábado - 9:30 - 11:30</SelectItem>
                <SelectItem value="saturday-afternoon-1">Sábado - 14:00 - 16:00</SelectItem>
                <SelectItem value="saturday-afternoon-2">Sábado - 16:00 - 18:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-gold transition-colors duration-200"
          >
            Salvar Agendamento
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard/resultados")}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Ver Provas Pendentes
          </button>
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
                <th className="p-3 text-left">Módulo</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Computador</th>
                <th className="p-3 text-left">Turno</th>
                <th className="p-3 text-left">Horário</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">{appointment.studentName}</td>
                  <td className="p-3">{appointment.moduleName}</td>
                  <td className="p-3">{appointment.examDate}</td>
                  <td className="p-3">{appointment.computerNumber}</td>
                  <td className="p-3">{appointment.shift}</td>
                  <td className="p-3">{appointment.classTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgendarProva;
