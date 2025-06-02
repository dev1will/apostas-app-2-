// Tela de Configurações
"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Sun, Moon, Target, TrendingUp, Download, Save, Building2 } from "lucide-react"

const allBettingHouses = [
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
]

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [dailyProfitGoal, setDailyProfitGoal] = useState("100")
  const [dailyEntriesGoal, setDailyEntriesGoal] = useState("5")
  const [selectedBettingHouses, setSelectedBettingHouses] = useState<string[]>([
    "bet365",
    "betano",
    "pixbet",
    "sportingbet",
  ])
  const { toast } = useToast()

  // Evita problemas de hidratação com o tema
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveGoals = () => {
    console.log({ dailyProfitGoal, dailyEntriesGoal })
    toast({
      title: "Metas Salvas!",
      description: "Suas metas diárias foram atualizadas.",
    })
  }

  const handleSaveBettingHouses = () => {
    console.log({ selectedBettingHouses })
    toast({
      title: "Casas de Aposta Salvas!",
      description: `${selectedBettingHouses.length} casas selecionadas.`,
    })
  }

  const handleExportData = () => {
    console.log("Exportando dados...")
    toast({
      title: "Exportação Iniciada",
      description: "Seus dados estão sendo preparados para download.",
    })
  }

  const handleBettingHouseToggle = (house: string, checked: boolean) => {
    if (checked) {
      setSelectedBettingHouses((prev) => [...prev, house])
    } else {
      setSelectedBettingHouses((prev) => prev.filter((h) => h !== house))
    }
  }

  const selectAllBettingHouses = () => {
    setSelectedBettingHouses([...allBettingHouses])
  }

  const deselectAllBettingHouses = () => {
    setSelectedBettingHouses([])
  }

  if (!mounted) {
    return null // Evita problemas de hidratação
  }

  return (
    <div className="container mx-auto max-w-lg space-y-8 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Configurações</h1>

      <Card className="dark:bg-theme-dark-card">
        <CardHeader>
          <CardTitle className="text-lg">Tema do Aplicativo</CardTitle>
          <CardDescription>Escolha entre o tema claro ou escuro.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {theme === "light" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-purple-400" />
              )}
              <Label htmlFor="theme-toggle" className="text-base">
                {theme === "light" ? "Tema Claro" : "Tema Escuro"}
              </Label>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Alternar tema"
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-theme-dark-card">
        <CardHeader>
          <CardTitle className="text-lg">Metas Diárias</CardTitle>
          <CardDescription>Defina suas metas de lucro e número de entradas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dailyProfitGoal" className="flex items-center">
              <Target className="mr-2 h-4 w-4 text-primary dark:text-theme-dark-primary" />
              Meta de Lucro Diário (R$)
            </Label>
            <Input
              id="dailyProfitGoal"
              type="number"
              step="1"
              placeholder="Ex: 100"
              value={dailyProfitGoal}
              onChange={(e) => setDailyProfitGoal(e.target.value)}
              className="mt-1 dark:bg-background dark:border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="dailyEntriesGoal" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-primary dark:text-theme-dark-primary" />
              Número de Entradas Diárias
            </Label>
            <Input
              id="dailyEntriesGoal"
              type="number"
              step="1"
              placeholder="Ex: 5"
              value={dailyEntriesGoal}
              onChange={(e) => setDailyEntriesGoal(e.target.value)}
              className="mt-1 dark:bg-background dark:border-gray-600"
            />
          </div>
          <Button
            onClick={handleSaveGoals}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-theme-dark-primary dark:hover:bg-theme-dark-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Metas
          </Button>
        </CardContent>
      </Card>

      <Card className="dark:bg-theme-dark-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Casas de Aposta Utilizadas
          </CardTitle>
          <CardDescription>Selecione as casas de aposta que você utiliza para facilitar o registro.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={selectAllBettingHouses}
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Selecionar Todas
            </Button>
            <Button
              onClick={deselectAllBettingHouses}
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Desmarcar Todas
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {allBettingHouses.map((house) => (
              <div key={house} className="flex items-center space-x-2">
                <Checkbox
                  id={house}
                  checked={selectedBettingHouses.includes(house)}
                  onCheckedChange={(checked) => handleBettingHouseToggle(house, checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:data-[state=checked]:bg-theme-dark-primary dark:data-[state=checked]:border-theme-dark-primary"
                />
                <Label htmlFor={house} className="text-sm font-normal capitalize cursor-pointer">
                  {house}
                </Label>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t dark:border-gray-700">
            <p className="text-sm text-muted-foreground mb-2">
              {selectedBettingHouses.length} de {allBettingHouses.length} casas selecionadas
            </p>
            <Button
              onClick={handleSaveBettingHouses}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-theme-dark-primary dark:hover:bg-theme-dark-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Casas Selecionadas
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-theme-dark-card">
        <CardHeader>
          <CardTitle className="text-lg">Gerenciamento de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleExportData}
            variant="outline"
            className="w-full dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Dados (CSV/JSON)
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Exporte todos os seus registros de lucros, prejuízos e bônus.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
