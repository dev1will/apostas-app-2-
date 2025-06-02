// Tela de Gerenciamento de FreeBets
"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Gift, AlertTriangle, CheckCircle, Clock, Trash2, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type FreebetStatus = "pendente" | "extraida" | "expirada"

interface FreebetEntry {
  id: string
  date: Date
  bettingHouse: string
  value: number
  status: FreebetStatus
  expiryDate?: Date
}

// Simulando casas selecionadas nas configurações
const selectedBettingHouses = ["bet365", "betano", "pixbet", "sportingbet", "stake", "betfair"]

const initialFreebetList: FreebetEntry[] = [
  {
    id: "f1",
    date: new Date(2024, 4, 20),
    bettingHouse: "bet365",
    value: 50,
    status: "pendente",
    expiryDate: new Date(2024, 4, 27),
  },
  {
    id: "f2",
    date: new Date(2024, 4, 18),
    bettingHouse: "betano",
    value: 25,
    status: "extraida",
  },
  {
    id: "f3",
    date: new Date(2024, 4, 15),
    bettingHouse: "pixbet",
    value: 30,
    status: "pendente",
    expiryDate: new Date(2024, 4, 22),
  },
  {
    id: "f4",
    date: new Date(2024, 3, 10),
    bettingHouse: "sportingbet",
    value: 20,
    status: "expirada",
  },
]

// Função para formatar data sem dependências externas
const formatDate = (date: Date) => {
  return date.toLocaleDateString("pt-BR")
}

// Função para converter string de data para objeto Date
const parseDate = (dateString: string) => {
  if (!dateString) return undefined
  return new Date(dateString)
}

// Função para converter Date para string no formato YYYY-MM-DD para input
const dateToInputValue = (date?: Date) => {
  if (!date) return ""
  return date.toISOString().split("T")[0]
}

export default function FreebetsPage() {
  const [freebetList, setFreebetList] = useState<FreebetEntry[]>(initialFreebetList)
  const [dateInput, setDateInput] = useState(dateToInputValue(new Date()))
  const [bettingHouse, setBettingHouse] = useState("")
  const [value, setValue] = useState("")
  const [expiryDateInput, setExpiryDateInput] = useState("")

  const { toast } = useToast()

  // Calcular alertas
  const pendingFreebets = freebetList.filter((f) => f.status === "pendente")
  const expiringFreebets = pendingFreebets.filter((f) => {
    if (!f.expiryDate) return false
    const today = new Date()
    const daysUntilExpiry = Math.ceil((f.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 3 && daysUntilExpiry >= 0
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!dateInput || !bettingHouse || !value) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const newFreebet: FreebetEntry = {
      id: `f${Date.now()}`,
      date: parseDate(dateInput) || new Date(),
      bettingHouse,
      value: Number.parseFloat(value),
      status: "pendente",
      expiryDate: parseDate(expiryDateInput),
    }

    setFreebetList((prev) => [newFreebet, ...prev])
    toast({
      title: "FreeBet Registrada!",
      description: `FreeBet de R$ ${value} em ${bettingHouse} adicionada com sucesso.`,
    })

    // Reset form
    setDateInput(dateToInputValue(new Date()))
    setBettingHouse("")
    setValue("")
    setExpiryDateInput("")
  }

  const handleStatusChange = (id: string, newStatus: FreebetStatus) => {
    setFreebetList((prev) => prev.map((freebet) => (freebet.id === id ? { ...freebet, status: newStatus } : freebet)))
    toast({
      title: "Status Atualizado",
      description: `FreeBet marcada como ${newStatus}.`,
    })
  }

  const handleDelete = (id: string) => {
    setFreebetList((prev) => prev.filter((freebet) => freebet.id !== id))
    toast({
      title: "FreeBet Removida",
      description: "FreeBet removida com sucesso.",
    })
  }

  const getStatusColor = (status: FreebetStatus) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-300"
      case "extraida":
        return "bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300"
      case "expirada":
        return "bg-gray-100 text-gray-800 dark:bg-gray-600/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-600/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: FreebetStatus) => {
    switch (status) {
      case "pendente":
        return <Clock className="mr-1.5 h-3.5 w-3.5" />
      case "extraida":
        return <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
      case "expirada":
        return <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
      default:
        return <Clock className="mr-1.5 h-3.5 w-3.5" />
    }
  }

  const totalPendingValue = pendingFreebets.reduce((sum, f) => sum + f.value, 0)

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Gerenciar FreeBets</h1>

      {/* Alertas de Extração */}
      {expiringFreebets.length > 0 && (
        <Alert className="border-red-500 dark:border-red-400">
          <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
          <AlertTitle className="text-red-700 dark:text-red-300">FreeBets Expirando!</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Você tem {expiringFreebets.length} FreeBet(s) expirando nos próximos 3 dias:</p>
            <div className="space-y-1">
              {expiringFreebets.map((freebet) => (
                <div key={freebet.id} className="flex justify-between items-center text-sm">
                  <span>
                    {freebet.bettingHouse.toUpperCase()} - R$ {freebet.value.toFixed(2)}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    Expira em{" "}
                    {freebet.expiryDate &&
                      Math.ceil((freebet.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                    dia(s)
                  </span>
                </div>
              ))}
            </div>
            <Link href="/calculadoras/surebet">
              <Button size="sm" className="mt-2">
                <Calculator className="mr-2 h-4 w-4" />
                Extrair Agora
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Resumo */}
      {pendingFreebets.length > 0 && (
        <Card className="dark:bg-theme-dark-card border-yellow-200 dark:border-yellow-700/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-yellow-700 dark:text-yellow-300">
              <Gift className="mr-2 h-5 w-5" />
              FreeBets Pendentes
            </CardTitle>
            <CardDescription>
              Você tem {pendingFreebets.length} FreeBet(s) pendente(s) no valor total de R${" "}
              {totalPendingValue.toFixed(2)}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Formulário para Nova FreeBet */}
      <Card className="dark:bg-theme-dark-card">
        <CardHeader>
          <CardTitle className="text-xl">Registrar Nova FreeBet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="bettingHouse">Casa de Aposta</Label>
                <Select value={bettingHouse} onValueChange={setBettingHouse} required>
                  <SelectTrigger className="mt-1 dark:bg-background dark:border-gray-600">
                    <SelectValue placeholder="Selecione a casa" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-theme-dark-card">
                    {selectedBettingHouses.map((house) => (
                      <SelectItem key={house} value={house}>
                        {house.charAt(0).toUpperCase() + house.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">Valor da FreeBet (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 50.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  className="mt-1 dark:bg-background dark:border-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="date">Data de Recebimento</Label>
                <Input
                  id="date"
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  required
                  className="mt-1 dark:bg-background dark:border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="expiryDate">Data de Expiração (Opcional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDateInput}
                  onChange={(e) => setExpiryDateInput(e.target.value)}
                  className="mt-1 dark:bg-background dark:border-gray-600"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-theme-dark-primary dark:hover:bg-theme-dark-primary/90"
            >
              Registrar FreeBet
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de FreeBets */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">FreeBets Registradas</h2>
        {freebetList.length > 0 ? (
          <div className="space-y-4">
            {freebetList.map((freebet) => (
              <Card key={freebet.id} className="dark:bg-theme-dark-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg capitalize">
                        {freebet.bettingHouse} - R$ {freebet.value.toFixed(2)}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div>Recebida em: {formatDate(freebet.date)}</div>
                        {freebet.expiryDate && (
                          <div
                            className={cn(
                              "text-sm",
                              freebet.status === "pendente" &&
                                freebet.expiryDate &&
                                Math.ceil(
                                  (freebet.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                                ) <= 3
                                ? "text-red-600 dark:text-red-400 font-medium"
                                : "",
                            )}
                          >
                            Expira em: {formatDate(freebet.expiryDate)}
                          </div>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          getStatusColor(freebet.status),
                        )}
                      >
                        {getStatusIcon(freebet.status)}
                        {freebet.status.charAt(0).toUpperCase() + freebet.status.slice(1)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(freebet.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {freebet.status === "pendente" && (
                  <CardContent className="pt-0">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(freebet.id, "extraida")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Marcar como Extraída
                      </Button>
                      <Link href="/calculadoras/surebet">
                        <Button size="sm" variant="outline" className="dark:border-gray-600 dark:hover:bg-gray-700">
                          <Calculator className="mr-2 h-4 w-4" />
                          Extrair Agora
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Nenhuma FreeBet registrada ainda.</p>
        )}
      </div>
    </div>
  )
}
