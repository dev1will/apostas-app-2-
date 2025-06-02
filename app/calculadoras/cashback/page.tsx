// Otimizando o componente de calculadora de cashback

"use client"

import { useState, type FormEvent, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BadgePercent, Gift } from "lucide-react"
import { useCurrency } from "@/components/currency-context"
import { useDebounce } from "@/hooks/use-debounce"

export default function CashbackPage() {
  const [betAmount, setBetAmount] = useState("")
  const [cashbackPercentage, setCashbackPercentage] = useState("")
  const [calculatedCashback, setCalculatedCashback] = useState<number | null>(null)

  const { formatCurrency } = useCurrency()

  // Usar debounce para cálculos automáticos sem sobrecarga de renderização
  const debouncedBetAmount = useDebounce(betAmount, 500)
  const debouncedCashbackPercentage = useDebounce(cashbackPercentage, 500)

  // Calcular automaticamente se ambos os valores estiverem preenchidos
  useMemo(() => {
    if (debouncedBetAmount && debouncedCashbackPercentage) {
      const amount = Number.parseFloat(debouncedBetAmount)
      const percentage = Number.parseFloat(debouncedCashbackPercentage)

      if (!isNaN(amount) && !isNaN(percentage) && amount > 0 && percentage > 0) {
        setCalculatedCashback((amount * percentage) / 100)
      }
    }
  }, [debouncedBetAmount, debouncedCashbackPercentage])

  const handleCalculateCashback = (e: FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(betAmount)
    const percentage = Number.parseFloat(cashbackPercentage)

    if (isNaN(amount) || isNaN(percentage) || amount <= 0 || percentage <= 0) {
      setCalculatedCashback(null)
      return
    }
    setCalculatedCashback((amount * percentage) / 100)
  }

  return (
    <Card className="dark:bg-theme-dark-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BadgePercent className="mr-2 h-5 w-5 text-primary dark:text-theme-dark-primary" />
          Calculadora de Cashback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculateCashback} className="space-y-6">
          <div>
            <Label htmlFor="betAmount">Valor Apostado</Label>
            <Input
              id="betAmount"
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="Ex: 100.00"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              required
              className="dark:bg-background dark:border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="cashbackPercentage">Porcentagem de Cashback (%)</Label>
            <Input
              id="cashbackPercentage"
              type="number"
              step="0.1"
              inputMode="decimal"
              placeholder="Ex: 10"
              value={cashbackPercentage}
              onChange={(e) => setCashbackPercentage(e.target.value)}
              required
              className="dark:bg-background dark:border-gray-600"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-theme-dark-primary dark:hover:bg-theme-dark-primary/90"
          >
            Calcular Cashback
          </Button>
        </form>

        {calculatedCashback !== null && (
          <Alert className="mt-6 border-green-500 dark:border-green-400">
            <Gift className="h-5 w-5 text-green-500 dark:text-green-400" />
            <AlertTitle className="text-green-700 dark:text-green-300">Cashback Calculado</AlertTitle>
            <AlertDescription className="text-lg font-semibold">{formatCurrency(calculatedCashback)}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
