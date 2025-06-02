// Tela de Registro de Bônus
"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Tag, CheckSquare, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

type BonusType = "freebet" | "rodadas_gratis" | "cashback_bonus" | "outro"
type BonusStatus = "ativo" | "usado" | "expirado"

interface BonusEntry {
  id: string
  date: Date
  description: string
  type: BonusType
  status: BonusStatus
  value?: number // Optional value for freebets/cashback
}

const initialBonusList: BonusEntry[] = [
  {
    id: "b1",
    date: new Date(2024, 4, 20),
    description: "Freebet R$20 - Aposta Ganha",
    type: "freebet",
    status: "ativo",
    value: 20,
  },
  {
    id: "b2",
    date: new Date(2024, 4, 15),
    description: "25 Rodadas Grátis - Slot XYZ",
    type: "rodadas_gratis",
    status: "usado",
  },
  {
    id: "b3",
    date: new Date(2024, 3, 10),
    description: "Cashback 10% semanal",
    type: "cashback_bonus",
    status: "expirado",
    value: 15.5,
  },
]

export default function BonusPage() {
  const [bonusList, setBonusList] = useState<BonusEntry[]>(initialBonusList)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [description, setDescription] = useState("")
  const [bonusType, setBonusType] = useState<BonusType>("freebet")
  const [bonusStatus, setBonusStatus] = useState<BonusStatus>("ativo")
  const [bonusValue, setBonusValue] = useState("")

  const { toast } = useToast()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!date || !description) {
      toast({
        title: "Erro",
        description: "Data e descrição são obrigatórios.",
        variant: "destructive",
      })
      return
    }
    const newBonus: BonusEntry = {
      id: `b${Date.now()}`,
      date,
      description,
      type: bonusType,
      status: bonusStatus,
      value: bonusValue ? Number.parseFloat(bonusValue) : undefined,
    }
    setBonusList((prev) => [newBonus, ...prev])
    toast({
      title: "Sucesso!",
      description: "Bônus registrado com sucesso.",
    })
    // Reset form
    setDate(new Date())
    setDescription("")
    setBonusType("freebet")
    setBonusStatus("ativo")
    setBonusValue("")
  }

  const getStatusColor = (status: BonusStatus) => {
    switch (status) {
      case "ativo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-300"
      case "usado":
        return "bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300"
      case "expirado":
        return "bg-gray-100 text-gray-800 dark:bg-gray-600/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-600/30 dark:text-gray-400"
    }
  }
  const getStatusIcon = (status: BonusStatus) => {
    switch (status) {
      case "ativo":
        return <Clock className="mr-1.5 h-3.5 w-3.5" />
      case "usado":
        return <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
      case "expirado":
        return <Tag className="mr-1.5 h-3.5 w-3.5" /> // Using Tag as a placeholder
      default:
        return <Tag className="mr-1.5 h-3.5 w-3.5" />
    }
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Registrar Bônus</h1>

      <Card className="dark:bg-theme-dark-card">
        <CardHeader>
          <CardTitle className="text-xl">Novo Bônus</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="description">Descrição do Bônus</Label>
              <Textarea
                id="description"
                placeholder="Ex: Freebet R$50 - Betano, 20 Rodadas Grátis no Starburst"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 dark:bg-background dark:border-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="date">Data de Recebimento/Validade</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal mt-1 dark:bg-background dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-theme-dark-card" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={ptBR}
                      className="dark:bg-theme-dark-card"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="bonusValue">Valor (Opcional)</Label>
                <Input
                  id="bonusValue"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 50.00 (para freebets)"
                  value={bonusValue}
                  onChange={(e) => setBonusValue(e.target.value)}
                  className="mt-1 dark:bg-background dark:border-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="bonusType">Tipo de Bônus</Label>
                <Select value={bonusType} onValueChange={(v) => setBonusType(v as BonusType)}>
                  <SelectTrigger className="mt-1 dark:bg-background dark:border-gray-600">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-theme-dark-card">
                    <SelectItem value="freebet">Freebet</SelectItem>
                    <SelectItem value="rodadas_gratis">Rodadas Grátis</SelectItem>
                    <SelectItem value="cashback_bonus">Cashback (Bônus)</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bonusStatus">Status do Bônus</Label>
                <Select value={bonusStatus} onValueChange={(v) => setBonusStatus(v as BonusStatus)}>
                  <SelectTrigger className="mt-1 dark:bg-background dark:border-gray-600">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-theme-dark-card">
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="usado">Usado</SelectItem>
                    <SelectItem value="expirado">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-theme-dark-primary dark:hover:bg-theme-dark-primary/90"
            >
              Salvar Bônus
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">Bônus Registrados</h2>
        {bonusList.length > 0 ? (
          <div className="space-y-4">
            {bonusList.map((bonus) => (
              <Card key={bonus.id} className="dark:bg-theme-dark-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{bonus.description}</CardTitle>
                      <CardDescription>
                        {format(bonus.date, "dd/MM/yyyy", { locale: ptBR })}
                        {bonus.value && ` - R$ ${bonus.value.toFixed(2)}`}
                      </CardDescription>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        getStatusColor(bonus.status),
                      )}
                    >
                      {getStatusIcon(bonus.status)}
                      {bonus.status.charAt(0).toUpperCase() + bonus.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tipo:{" "}
                    <span className="font-medium text-foreground">
                      {bonus.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Nenhum bônus registrado ainda.</p>
        )}
      </div>
    </div>
  )
}
