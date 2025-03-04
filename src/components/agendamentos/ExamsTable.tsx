
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Exam {
  id: string;
  student_name: string;
  exam_date: string;
  exam_type: string;
  status: string;
  computer_number: number;
  class_time: string;
}

interface ExamsTableProps {
  exams: Exam[] | null;
  isLoading: boolean;
}

const ExamsTable = ({ exams, isLoading }: ExamsTableProps) => {
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

  return (
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
          ) : exams && exams.length > 0 ? (
            exams.map((exam) => (
              <TableRow
                key={exam.id}
                className="hover:bg-primary/5 transition-colors"
              >
                <TableCell>{exam.student_name}</TableCell>
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
  );
};

export default ExamsTable;
