// Otimizar o provider com memoização para reduzir renderizações

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react"

type Currency = "BRL" | "USD" | "EUR"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (amount: number) => string
  getCurrencySymbol: () => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("BRL")

  // Carregar moeda do localStorage
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem("preferred-currency") as Currency
      if (savedCurrency && ["BRL", "USD", "EUR"].includes(savedCurrency)) {
        setCurrency(savedCurrency)
      }
    } catch (e) {
      // Falha silenciosa se localStorage não estiver disponível
      console.error("Erro ao acessar localStorage:", e)
    }
  }, [])

  // Salvar moeda no localStorage
  const handleSetCurrency = useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency)
    try {
      localStorage.setItem("preferred-currency", newCurrency)
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e)
    }
  }, [])

  // Memoizar formatadores para evitar recriações desnecessárias
  const formatters = useMemo(
    () => ({
      BRL: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }),
      USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
      EUR: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }),
    }),
    [],
  )

  const formatCurrency = useCallback(
    (amount: number): string => {
      return formatters[currency].format(amount)
    },
    [currency, formatters],
  )

  const getCurrencySymbol = useCallback((): string => {
    const symbols = {
      BRL: "R$",
      USD: "$",
      EUR: "€",
    }
    return symbols[currency]
  }, [currency])

  // Memoizar o valor do contexto para evitar re-renderizações desnecessárias
  const contextValue = useMemo(
    () => ({
      currency,
      setCurrency: handleSetCurrency,
      formatCurrency,
      getCurrencySymbol,
    }),
    [currency, handleSetCurrency, formatCurrency, getCurrencySymbol],
  )

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
