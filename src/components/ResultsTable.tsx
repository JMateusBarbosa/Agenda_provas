
import { format } from "date-fns";
import { Check, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ProvaType } from "@/types/prova";

interface ResultsTableProps {
  provas: ProvaType[];
  onResultado: (provaId: number, aprovado: boolean) => void;
  onDataRecuperacaoChange: (provaId: number, novaData: Date | undefined) => void;
}

export const ResultsTable = ({
  provas,
  onResultado,
  onDataRecuperacaoChange,
}: ResultsTableProps) => {
  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full align-middle">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Aluno</TableHead>
              <TableHead className="whitespace-nowrap">Módulo</TableHead>
              <TableHead className="whitespace-nowrap">Data</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Tipo</TableHead>
              <TableHead className="whitespace-nowrap">Recuperação</TableHead>
              <TableHead className="whitespace-nowrap">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {provas.map((prova) => (
              <TableRow key={prova.id} className="[&>td]:py-2">
                <TableCell className="font-medium">{prova.nomeAluno}</TableCell>
                <TableCell>{prova.modulo}</TableCell>
                <TableCell>{format(new Date(prova.dataProva), 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                      prova.status === "Aprovado"
                        ? "bg-green-100 text-green-800"
                        : prova.status === "Reprovado"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {prova.status}
                  </span>
                </TableCell>
                <TableCell>{prova.tipoProva}</TableCell>
                <TableCell>
                  {prova.dataRecuperacao && (
                    <div className="flex items-center space-x-2">
                      <span>{format(new Date(prova.dataRecuperacao), 'dd/MM/yyyy')}</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Editar data</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(prova.dataRecuperacao)}
                            onSelect={(date) => onDataRecuperacaoChange(prova.id, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col md:flex-row gap-2">
                    <Button
                      onClick={() => onResultado(prova.id, true)}
                      variant="outline"
                      size="sm"
                      className="bg-green-50 hover:bg-green-100 text-green-600"
                      disabled={prova.status !== "Pendente"}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      <span className="whitespace-nowrap">Aprovado</span>
                    </Button>
                    <Button
                      onClick={() => onResultado(prova.id, false)}
                      variant="outline"
                      size="sm"
                      className="bg-red-50 hover:bg-red-100 text-red-600"
                      disabled={prova.status !== "Pendente"}
                    >
                      <X className="w-4 h-4 mr-1" />
                      <span className="whitespace-nowrap">Reprovado</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
