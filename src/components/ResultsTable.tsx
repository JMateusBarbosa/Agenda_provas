
import { format } from "date-fns";
import { Check, X, Edit2, Calendar, Save } from "lucide-react";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ProvaType } from "@/types/prova";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResultsTableProps {
  provas: ProvaType[];
  onResultado: (provaId: number, aprovado: boolean) => void;
  onDataRecuperacaoChange: (provaId: number, novaData: Date | undefined) => void;
  onExamUpdate: (provaId: number, dadosAtualizados: Partial<ProvaType>) => void;
}

export const ResultsTable = ({
  provas,
  onResultado,
  onDataRecuperacaoChange,
  onExamUpdate,
}: ResultsTableProps) => {
  const [editingExam, setEditingExam] = useState<ProvaType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<ProvaType>>({});

  const handleEdit = (prova: ProvaType) => {
    setEditingExam(prova);
    setFormData({
      nomeAluno: prova.nomeAluno,
      modulo: prova.modulo,
      dataProva: prova.dataProva,
      status: prova.status,
      tipoProva: prova.tipoProva,
      recovery_date: prova.recovery_date,
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingExam) {
      onExamUpdate(Number(editingExam.id), formData);
      setOpenDialog(false);
      setEditingExam(null);
    }
  };

  return (
    <>
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
                        prova.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : prova.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {prova.status === "approved" 
                        ? "Aprovado" 
                        : prova.status === "failed" 
                        ? "Reprovado" 
                        : "Pendente"}
                    </span>
                  </TableCell>
                  <TableCell>{prova.tipoProva}</TableCell>
                  <TableCell>
                    {prova.recovery_date && (
                      <div className="flex items-center space-x-2">
                        <span>{format(new Date(prova.recovery_date), 'dd/MM/yyyy')}</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Calendar className="h-4 w-4" />
                              <span className="sr-only">Editar data</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={new Date(prova.recovery_date)}
                              onSelect={(date) => onDataRecuperacaoChange(Number(prova.id), date)}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <Button
                        onClick={() => onResultado(Number(prova.id), true)}
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100 text-green-600"
                        disabled={prova.status !== "pending"}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        <span className="whitespace-nowrap">Aprovado</span>
                      </Button>
                      <Button
                        onClick={() => onResultado(Number(prova.id), false)}
                        variant="outline"
                        size="sm"
                        className="bg-red-50 hover:bg-red-100 text-red-600"
                        disabled={prova.status !== "pending"}
                      >
                        <X className="w-4 h-4 mr-1" />
                        <span className="whitespace-nowrap">Reprovado</span>
                      </Button>
                      <Button
                        onClick={() => handleEdit(prova)}
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        <span className="whitespace-nowrap">Editar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Exame</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nomeAluno" className="text-right">
                Nome do Aluno
              </Label>
              <Input
                id="nomeAluno"
                value={formData.nomeAluno || ""}
                onChange={(e) => setFormData({ ...formData, nomeAluno: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modulo" className="text-right">
                Módulo
              </Label>
              <Input
                id="modulo"
                value={formData.modulo || ""}
                onChange={(e) => setFormData({ ...formData, modulo: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoProva" className="text-right">
                Tipo
              </Label>
              <Select
                value={formData.tipoProva}
                onValueChange={(value: any) => setFormData({ ...formData, tipoProva: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="Rec.1">Rec.1</SelectItem>
                  <SelectItem value="Rec.2">Rec.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="failed">Reprovado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataProva" className="text-right">
                Data da Prova
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.dataProva ? (
                        format(new Date(formData.dataProva), 'dd/MM/yyyy')
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.dataProva ? new Date(formData.dataProva) : undefined}
                      onSelect={(date) => setFormData({ ...formData, dataProva: date?.toISOString() })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recuperacao" className="text-right">
                Data de Recuperação
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.recovery_date ? (
                        format(new Date(formData.recovery_date), 'dd/MM/yyyy')
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.recovery_date ? new Date(formData.recovery_date) : undefined}
                      onSelect={(date) => setFormData({ ...formData, recovery_date: date?.toISOString() })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
