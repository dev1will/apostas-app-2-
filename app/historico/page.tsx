// Tela de Histórico de Registros
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, FilterIcon, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

type OperationType = "todos" | "lucro" | "prejuizo"
interface Registro {
  id: string
  date: Date
  type: "lucro" | "prejuizo"
  value: number
  bettingHouse: string
  profitType?: string // Para lucros
}

const bettingHousesOptions = [
  "Todas",
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

const mockRegistros: Registro[] = [
  { id: "1", date: new Date(2024, 4, 15), type: "lucro", value: 50.0, bettingHouse: "bet365", profitType: "Surebet" },
  { id: "2", date: new Date(2024, 4, 16), type: "prejuizo", value: 25.5, bettingHouse: "betano" },
  {
    id: "3",
    date: new Date(2024, 4, 17),
    type: "lucro",
    value: 120.75,
    bettingHouse: "sportingbet",
    profitType: "Super ODD",
  },
  {
    id: "4",
    date: new Date(2024, 4, 18),
    type: "lucro",
    value: 30.0,
    bettingHouse: "bet365",
    profitType: "Extração de Freebet",
  },
  { id: "5", date: new Date(2024, 4, 19), type: "prejuizo", value: 70.0, bettingHouse: "pixbet" },
]

export default function HistoricoPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [operationType, setOperationType] = useState<OperationType>("todos")
  const [bettingHouseFilter, setBettingHouseFilter] = useState<string>("Todas")

  const filteredRegistros = mockRegistros.filter((reg) => {
    const dateFilter =
      dateRange?.from && dateRange?.to
        ? reg.date >= dateRange.from && reg.date <= dateRange.to
        : dateRange?.from
          ? reg.date >= dateRange.from
          : true
    const typeFilter = operationType === "todos" ? true : reg.type === operationType
    const houseFilter = bettingHouseFilter === "Todas" ? true : reg.bettingHouse === bettingHouseFilter
    return dateFilter && typeFilter && houseFilter
  })

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Histórico de Registros</h1>

      <Card className="dark:bg-theme-dark-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FilterIcon className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="dateRange" className="text-sm font-medium">
                Período
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateRange"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1 dark:bg-background dark:border-gray-600 dark:hover:bg-gray-700",
                      !dateRange && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                          {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y", { locale: ptBR })
                      )
                    ) : (
                      <span>Escolha um período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-theme-dark-card" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={ptBR}
                    className="dark:bg-theme-dark-card"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="operationType" className="text-sm font-medium">
                Tipo de Operação
              </Label>
              <Select value={operationType} onValueChange={(v) => setOperationType(v as OperationType)}>
                <SelectTrigger className="mt-1 dark:bg-background dark:border-gray-600">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="dark:bg-theme-dark-card">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="lucro">Lucro</SelectItem>
                  <SelectItem value="prejuizo">Prejuízo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bettingHouseFilter" className="text-sm font-medium">
                Casa de Aposta
              </Label>
              <Select value={bettingHouseFilter} onValueChange={setBettingHouseFilter}>
                <SelectTrigger className="mt-1 dark:bg-background dark:border-gray-600">
                  <SelectValue placeholder="Selecione a casa" />
                </SelectTrigger>
                <SelectContent className="dark:bg-theme-dark-card">
                  {bettingHousesOptions.map((house) => (
                    <SelectItem key={house} value={house}>
                      {house.charAt(0).toUpperCase() + house.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-theme-dark-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="w-[120px]">Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Casa</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistros.length > 0 ? (
                filteredRegistros.map((reg) => (
                  <TableRow key={reg.id} className="dark:border-gray-700">
                    <TableCell>{format(reg.date, "dd/MM/yy", { locale: ptBR })}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          reg.type === "lucro"
                            ? "bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-700/30 dark:text-red-300",
                        )}
                      >
                        {reg.type === "lucro" ? (
                          <ArrowUpWideNarrow className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownWideNarrow className="mr-1 h-3 w-3" />
                        )}
                        {reg.type.charAt(0).toUpperCase() + reg.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="capitalize">{reg.bettingHouse}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{reg.profitType || "-"}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        reg.type === "lucro" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                      )}
                    >
                      {reg.type === "prejuizo" && "-"}R$ {reg.value.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum registro encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
