
import { format } from "date-fns";

interface Exam {
  id: string;
  student_name: string;
  exam_date: string;
  exam_type: string;
  status: string;
  computer_number: number;
  class_time: string;
  recovery_date?: string;
}

interface AdminExamsTableProps {
  exams: Exam[] | null;
  isLoading: boolean;
}

const AdminExamsTable = ({ exams, isLoading }: AdminExamsTableProps) => {
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

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-muted">
            <th className="p-3 text-left font-semibold">Aluno</th>
            <th className="p-3 text-left font-semibold">Tipo</th>
            <th className="p-3 text-left font-semibold">Data</th>
            <th className="p-3 text-left font-semibold">Computador</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Recuperação</th>
            <th className="p-3 text-left font-semibold">Horário</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                Carregando agendamentos...
              </td>
            </tr>
          ) : exams && exams.length > 0 ? (
            exams.map((exam) => (
              <tr
                key={exam.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="p-3">{exam.student_name}</td>
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
                <td className="p-3">
                  {exam.recovery_date && format(new Date(exam.recovery_date), "dd/MM/yyyy")}
                </td>
                <td className="p-3">{exam.class_time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhum agendamento encontrado com os filtros selecionados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminExamsTable;
