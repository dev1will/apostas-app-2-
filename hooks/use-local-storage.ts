"use client"

import { useState, useEffect } from "react"

// Hook genérico para interagir com localStorage de forma segura
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Função para obter o valor armazenado
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Erro ao ler ${key} do localStorage:`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = useState<T>(readValue)

  // Função para atualizar o valor
  const setValue = (value: T) => {
    if (typeof window === "undefined") {
      console.warn(`Não é possível salvar ${key} no localStorage quando executando no servidor.`)
      return
    }

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
      setStoredValue(valueToStore)
      window.dispatchEvent(new Event("local-storage"))
    } catch (error) {
      console.warn(`Erro ao salvar ${key} no localStorage:`, error)
    }
  }

  useEffect(() => {
    setStoredValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sincronizar com outras abas/janelas
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue())
    }
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("local-storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("local-storage", handleStorageChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [storedValue, setValue]
}
