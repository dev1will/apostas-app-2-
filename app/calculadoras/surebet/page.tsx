// Calculadora de Surebet com extração de freebet
"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, XCircle, Sigma, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SurebetPage() {
  // Valores da Casa de Apostas
  const [backOdd, setBackOdd] = useState<string>("2.0")
  const [backStake, setBackStake] = useState<string>("100")
  const [isFreebet, setIsFreebet] = useState<boolean>(false)
  const [currency, setCurrency] = useState<string>("R$")

  // Valores da Betfair/Exchange
  const [layOdd, setLayOdd] = useState<string>("2.1")
  const [layStake, setLayStake] = useState<string>("105")
  const [commission, setCommission] = useState<string>("6.5")
  const [requiredBalance, setRequiredBalance] = useState<string>("0")

  // Gerenciamento de risco
  const [riskSlider, setRiskSlider] = useState<number>(50)

  // Resultados
  const [result, setResult] = useState<{
    profitIfBackWins: number
    profitIfLayWins: number
    isSurebet: boolean
    profitPercentage: number
    requiredBalance: number
  } | null>(null)

  // Calcular automaticamente quando os valores mudam
  useEffect(() => {
    calculateMatchedBetting()
  }, [backOdd, backStake, layOdd, commission, isFreebet, riskSlider])

  // Calcular o valor da aposta lay com base no slider de risco
  useEffect(() => {
    if (backOdd && layOdd && backStake && commission) {
      const backOddNum = Number.parseFloat(backOdd)
      const layOddNum = Number.parseFloat(layOdd)
      const backStakeNum = Number.parseFloat(backStake)
      const commissionNum = Number.parseFloat(commission) / 100

      // Cálculo base da aposta lay
      let optimalLayStake = backStakeNum * (backOddNum / (layOddNum - commissionNum))

      // Se for freebet, o cálculo é diferente
      if (isFreebet) {
        optimalLayStake = (backStakeNum * (backOddNum - 1)) / (layOddNum - commissionNum)
      }

      // Ajustar com base no slider de risco (0 = mais risco na casa, 100 = mais risco na exchange)
      const riskFactor = (riskSlider - 50) / 100 // -0.5 a 0.5
      const adjustedLayStake = optimalLayStake * (1 + riskFactor * 0.2) // Ajuste de até 20% para mais ou menos

      setLayStake(adjustedLayStake.toFixed(2))
      calculateMatchedBetting()
    }
  }, [backOdd, layOdd, backStake, commission, isFreebet, riskSlider])

  const calculateMatchedBetting = () => {
    if (!backOdd || !layOdd || !backStake || !layStake || !commission) {
      setResult(null)
      return
    }

    const backOddNum = Number.parseFloat(backOdd)
    const layOddNum = Number.parseFloat(layOdd)
    const backStakeNum = Number.parseFloat(backStake)
    const layStakeNum = Number.parseFloat(layStake)
    const commissionNum = Number.parseFloat(commission) / 100

    // Cálculo do saldo necessário
    const requiredBalanceValue = layStakeNum * (layOddNum - 1)
    setRequiredBalance(requiredBalanceValue.toFixed(2))

    // Cálculo de lucro/prejuízo
    let profitIfBackWins, profitIfLayWins

    if (isFreebet) {
      // Se for freebet, o stake não é devolvido
      profitIfBackWins = backStakeNum * (backOddNum - 1) - layStakeNum * (layOddNum - 1)
      profitIfLayWins = -backStakeNum * 0 + layStakeNum * (1 - commissionNum) // Não perde o stake na freebet
    } else {
      // Aposta normal
      profitIfBackWins = backStakeNum * backOddNum - backStakeNum - layStakeNum * (layOddNum - 1)
      profitIfLayWins = -backStakeNum + layStakeNum * (1 - commissionNum)
    }

    // Verificar se é surebet
    const isSurebet = profitIfBackWins > 0 && profitIfLayWins > 0

    // Calcular percentual de lucro
    const totalInvested = isFreebet ? layStakeNum * (layOddNum - 1) : backStakeNum + layStakeNum * (layOddNum - 1)
    const minProfit = Math.min(profitIfBackWins, profitIfLayWins)
    const profitPercentage = (minProfit / totalInvested) * 100

    setResult({
      profitIfBackWins,
      profitIfLayWins,
      isSurebet,
      profitPercentage,
      requiredBalance: requiredBalanceValue,
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    calculateMatchedBetting()
  }

  return (
    <Card className="dark:bg-theme-dark-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Sigma className="mr-2 h-5 w-5 text-primary dark:text-theme-dark-primary" />
          Calculadora de Matched Betting
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Casa de Apostas */}
          <div className="space-y-4 rounded-md border p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground dark:bg-theme-dark-primary dark:text-white mr-2">
                  1
                </span>
                APOSTA NA CASA DE APOSTAS
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="backOdd">Odd:</Label>
                <Input
                  id="backOdd"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 2.0"
                  value={backOdd}
                  onChange={(e) => setBackOdd(e.target.value)}
                  required
                  className="dark:bg-background dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="backStake">Aposta a Favor:</Label>
                <Input
                  id="backStake"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 100.00"
                  value={backStake}
                  onChange={(e) => setBackStake(e.target.value)}
                  required
                  className="dark:bg-background dark:border-gray-600"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFreebet"
                checked={isFreebet}
                onCheckedChange={(checked) => setIsFreebet(checked as boolean)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:data-[state=checked]:bg-theme-dark-primary dark:data-[state=checked]:border-theme-dark-primary"
              />
              <Label htmlFor="isFreebet" className="text-sm font-medium cursor-pointer">
                Freebet (aposta não devolvida)
              </Label>
            </div>

            <div>
              <Label className="text-sm font-medium">Moeda</Label>
              <RadioGroup value={currency} onValueChange={setCurrency} className="flex space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="€" id="euro" />
                  <Label htmlFor="euro">€</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="£" id="libra" />
                  <Label htmlFor="libra">£</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="$" id="dolar" />
                  <Label htmlFor="dolar">$</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="R$" id="real" />
                  <Label htmlFor="real">R$</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Seção 2: Betfair/Exchange */}
          <div className="space-y-4 rounded-md border p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground dark:bg-theme-dark-primary dark:text-white mr-2">
                  2
                </span>
                APOSTA LAY NA BETFAIR
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="layOdd">Odd Lay:</Label>
                <Input
                  id="layOdd"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 2.1"
                  value={layOdd}
                  onChange={(e) => setLayOdd(e.target.value)}
                  required
                  className="dark:bg-background dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="layStake">Aposta Contra:</Label>
                <Input
                  id="layStake"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 105.00"
                  value={layStake}
                  onChange={(e) => setLayStake(e.target.value)}
                  required
                  className="dark:bg-background dark:border-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commission">Comissão (%):</Label>
                <Input
                  id="commission"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 6.5"
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  required
                  className="dark:bg-background dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="requiredBalance">Saldo necessário:</Label>
                <Input
                  id="requiredBalance"
                  type="text"
                  value={`${currency} ${requiredBalance}`}
                  readOnly
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Gerir Risco:</Label>
                <div className="flex justify-between text-sm w-full">
                  <span>Casa</span>
                  <span>Betfair</span>
                </div>
              </div>
              <Slider
                value={[riskSlider]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setRiskSlider(value[0])}
                className="[&>span]:bg-primary dark:[&>span]:bg-theme-dark-primary"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Moeda</Label>
              <RadioGroup value={currency} onValueChange={setCurrency} className="flex space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="€" id="euro2" />
                  <Label htmlFor="euro2">€</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="£" id="libra2" />
                  <Label htmlFor="libra2">£</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="$" id="dolar2" />
                  <Label htmlFor="dolar2">$</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="R$" id="real2" />
                  <Label htmlFor="real2">R$</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Seção 3: Resultados */}
          <div className="space-y-4 rounded-md border p-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold">LUCRO / PREJUÍZO</h3>

            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">1) Se ganhar na Casa:</Label>
                    <div
                      className={cn(
                        "p-2 rounded-md font-medium",
                        result.profitIfBackWins >= 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                      )}
                    >
                      {currency} {result.profitIfBackWins.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">2) Se ganhar na Betfair:</Label>
                    <div
                      className={cn(
                        "p-2 rounded-md font-medium",
                        result.profitIfLayWins >= 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                      )}
                    >
                      {currency} {result.profitIfLayWins.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Alert
                  className={cn(
                    "mt-4",
                    result.isSurebet
                      ? "border-green-500 dark:border-green-400"
                      : result.profitIfBackWins >= 0 || result.profitIfLayWins >= 0
                        ? "border-yellow-500 dark:border-yellow-400"
                        : "border-red-500 dark:border-red-400",
                  )}
                >
                  {result.isSurebet ? (
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  ) : result.profitIfBackWins >= 0 || result.profitIfLayWins >= 0 ? (
                    <ArrowRight className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  )}
                  <AlertTitle
                    className={
                      result.isSurebet
                        ? "text-green-700 dark:text-green-300"
                        : result.profitIfBackWins >= 0 || result.profitIfLayWins >= 0
                          ? "text-yellow-700 dark:text-yellow-300"
                          : "text-red-700 dark:text-red-300"
                    }
                  >
                    {result.isSurebet
                      ? "Surebet Garantida!"
                      : result.profitIfBackWins >= 0 || result.profitIfLayWins >= 0
                        ? "Extração de Valor Possível"
                        : "Não é uma Surebet"}
                  </AlertTitle>
                  <AlertDescription className="space-y-1 text-sm">
                    {isFreebet ? (
                      <p>
                        Extração de Freebet:{" "}
                        <span className="font-semibold">
                          {(
                            (Math.max(result.profitIfBackWins, result.profitIfLayWins) / Number.parseFloat(backStake)) *
                            100
                          ).toFixed(2)}
                          % do valor
                        </span>
                      </p>
                    ) : (
                      <p>
                        Percentual de Lucro/Prejuízo:{" "}
                        <span
                          className={cn(
                            "font-semibold",
                            result.profitPercentage >= 0
                              ? "text-green-700 dark:text-green-300"
                              : "text-red-700 dark:text-red-300",
                          )}
                        >
                          {result.profitPercentage.toFixed(2)}%
                        </span>
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-theme-dark-primary dark:hover:bg-theme-dark-primary/90"
          >
            Recalcular
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
