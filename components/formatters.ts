// Utilitários de formatação para evitar recriações de funções

// Formatar data sem dependências externas
export function formatDate(date: Date | string): string {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return date.toLocaleDateString("pt-BR")
}

// Converter string de data para objeto Date
export function parseDate(dateString: string): Date | undefined {
  if (!dateString) return undefined
  return new Date(dateString)
}

// Converter Date para string no formato YYYY-MM-DD para input
export function dateToInputValue(date?: Date): string {
  if (!date) return ""
  return date.toISOString().split("T")[0]
}

// Formato de moeda
export function formatCurrency(amount: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount)
}

// Números com separadores de milhares
export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}
