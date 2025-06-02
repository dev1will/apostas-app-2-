// Tela de Registro de Lucros e Prejuízos
"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, DollarSign, Landmark, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useAuth } from "@/components/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { supabase } from "@/lib/supabase"

const bettingHouses = [
  "vbet",
  "pixbet",
  "betano",
  "estrela",
  "esportiva",
  "bet365",
  "pinnacle",
  "stake",
  "betfair",
  "betvip",
  "brbet",
  "vivasorte",
  "cassino",
  "R7",
  "segurobet",
  "apostaganha",
  "sportingbet",
  "f12",
  "mcgames",
  "betesporte",
  "novibet",
  "brabet",
  "fulltbet",
  "casa de apostas",
  "bolsa de aposta",
  "Outra",
]

const profitTypes = ["Surebet", "Extração de Freebet", "Rodadas Grátis", "Super ODD"]

export default function RegistroPage() {
  const [activeTab, setActiveTab] = useState<"lucro" | "prejuizo">("lucro")

  // Estados para Lucro
  const [profitValue, setProfitValue] = useState("")
  const [profitDate, setProfitDate] = useState<Date | undefined>(new Date())
  const [profitType, setProfitType] = useState("")
  const [profitBettingHouse, setProfitBettingHouse] = useState("")
  const [profitCustomBettingHouse, setProfitCustomBettingHouse] = useState("")

  // Estados para Prejuízo
  const [lossValue, setLossValue] = useState("")
  const [lossDate, setLossDate] = useState<Date | undefined>(new Date())
  const [lossBettingHouse, setLossBettingHouse] = useState("")
  const [lossCustomBettingHouse, setLossCustomBettingHouse] = useState("")

  const { user } = useAuth()
  const { toast } = useToast()

  const handleProfitSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const finalBettingHouse = profitBettingHouse === "Outra" ? profitCustomBettingHouse : profitBettingHouse
    if (!profitValue || !profitDate || !profitType || !finalBettingHouse) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      // Obter token de autenticação
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (!sessionData.session || !user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para registrar uma aposta.",
          variant: "destructive",
        })
        return
      }

      // Enviar dados para a API
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({
          value: parseFloat(profitValue),
          date: profitDate,
          type: "lucro",
          bettingHouse: finalBettingHouse,
          isProfit: true,
          profitType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao registrar lucro')
      }

      toast({
        title: "Sucesso!",
        description: `Lucro de R$ ${profitValue} (${profitType}) em ${finalBettingHouse} registrado.`,
      })

      // Reset form
      setProfitValue("")
      setProfitDate(new Date())
      setProfitType("")
      setProfitBettingHouse("")
      setProfitCustomBettingHouse("")
    } catch (error: any) {
      console.error('Erro ao registrar lucro:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar o lucro. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleLossSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const finalBettingHouse = lossBettingHouse === "Outra" ? lossCustomBettingHouse : lossBettingHouse
    if (!lossValue || !lossDate || !finalBettingHouse) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      // Obter token de autenticação
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (!sessionData.session || !user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para registrar uma aposta.",
          variant: "destructive",
        })
        return
      }

      // Enviar dados para a API
      const response = await fetch('/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({
          value: parseFloat(lossValue),
          date: lossDate,
          type: "prejuizo",
          bettingHouse: finalBettingHouse,
          isProfit: false,
          profitType: null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao registrar prejuízo')
      }

      toast({
        title: "Sucesso!",
        description: `Prejuízo de R$ ${lossValue} em ${finalBettingHouse} registrado.`,
      })

      // Reset form
      setLossValue("")
      setLossDate(new Date())
      setLossBettingHouse("")
      setLossCustomBettingHouse("")
    } catch (error: any) {
      console.error('Erro ao registrar prejuízo:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar o prejuízo. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-md space-y-6 p-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Registrar Operação</h1>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "lucro" | "prejuizo")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-theme-dark-card">
            <TabsTrigger
              value="lucro"
              className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-700/30 dark:data-[state=active]:text-green-300"
            >
              <TrendingUp className="h-4 w-4" />
              Lucro
            </TabsTrigger>
            <TabsTrigger
              value="prejuizo"
              className="flex items-center gap-2 data-[state=active]:bg-red-100 data-[state=active]:text-red-800 dark:data-[state=active]:bg-red-700/30 dark:data-[state=active]:text-red-300"
            >
              <TrendingDown className="h-4 w-4" />
              Prejuízo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lucro" className="mt-6">
            <Card className="dark:bg-theme-dark-card border-green-200 dark:border-green-700/30">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Registrar Lucro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfitSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="profitValue" className="text-sm font-medium">
                      Valor (R$)
                    </Label>
                    <div className="relative mt-1">
                      <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="profitValue"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={profitValue}
                        onChange={(e) => setProfitValue(e.target.value)}
                        required
                        className="pl-10 dark:bg-theme-dark-card dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="profitDate" className="text-sm font-medium">
                      Data
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal mt-1 dark:bg-theme-dark-card dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {profitDate ? format(profitDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 dark:bg-theme-dark-card" align="start">
                        <Calendar
                          mode="single"
                          selected={profitDate}
                          onSelect={setProfitDate}
                          initialFocus
                          locale={ptBR}
                          className="dark:bg-theme-dark-card"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="profitType" className="text-sm font-medium">
                      Tipo de Lucro
                    </Label>
                    <Select value={profitType} onValueChange={setProfitType} required>
                      <SelectTrigger className="mt-1 dark:bg-theme-dark-card dark:border-gray-600">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-theme-dark-card">
                        {profitTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="profitBettingHouse" className="text-sm font-medium">
                      Casa de Aposta
                    </Label>
                    <div className="relative mt-1">
                      <Landmark className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Select value={profitBettingHouse} onValueChange={setProfitBettingHouse} required>
                        <SelectTrigger className="w-full pl-10 dark:bg-theme-dark-card dark:border-gray-600">
                          <SelectValue placeholder="Selecione a casa" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-theme-dark-card">
                          {bettingHouses.map((house) => (
                            <SelectItem key={house} value={house}>
                              {house.charAt(0).toUpperCase() + house.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {profitBettingHouse === "Outra" && (
                    <div>
                      <Label htmlFor="profitCustomBettingHouse" className="text-sm font-medium">
                        Nome da Casa (Outra)
                      </Label>
                      <Input
                        id="profitCustomBettingHouse"
                        type="text"
                        placeholder="Digite o nome da casa"
                        value={profitCustomBettingHouse}
                        onChange={(e) => setProfitCustomBettingHouse(e.target.value)}
                        required
                        className="mt-1 dark:bg-theme-dark-card dark:border-gray-600"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    Registrar Lucro
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prejuizo" className="mt-6">
            <Card className="dark:bg-theme-dark-card border-red-200 dark:border-red-700/30">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-300 flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5" />
                  Registrar Prejuízo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLossSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="lossValue" className="text-sm font-medium">
                      Valor (R$)
                    </Label>
                    <div className="relative mt-1">
                      <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="lossValue"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={lossValue}
                        onChange={(e) => setLossValue(e.target.value)}
                        required
                        className="pl-10 dark:bg-theme-dark-card dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lossDate" className="text-sm font-medium">
                      Data
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal mt-1 dark:bg-theme-dark-card dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {lossDate ? format(lossDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 dark:bg-theme-dark-card" align="start">
                        <Calendar
                          mode="single"
                          selected={lossDate}
                          onSelect={setLossDate}
                          initialFocus
                          locale={ptBR}
                          className="dark:bg-theme-dark-card"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="lossBettingHouse" className="text-sm font-medium">
                      Casa de Aposta
                    </Label>
                    <div className="relative mt-1">
                      <Landmark className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Select value={lossBettingHouse} onValueChange={setLossBettingHouse} required>
                        <SelectTrigger className="w-full pl-10 dark:bg-theme-dark-card dark:border-gray-600">
                          <SelectValue placeholder="Selecione a casa" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-theme-dark-card">
                          {bettingHouses.map((house) => (
                            <SelectItem key={house} value={house}>
                              {house.charAt(0).toUpperCase() + house.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {lossBettingHouse === "Outra" && (
                    <div>
                      <Label htmlFor="lossCustomBettingHouse" className="text-sm font-medium">
                        Nome da Casa (Outra)
                      </Label>
                      <Input
                        id="lossCustomBettingHouse"
                        type="text"
                        placeholder="Digite o nome da casa"
                        value={lossCustomBettingHouse}
                        onChange={(e) => setLossCustomBettingHouse(e.target.value)}
                        required
                        className="mt-1 dark:bg-theme-dark-card dark:border-gray-600"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    Registrar Prejuízo
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
