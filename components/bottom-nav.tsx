"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, PlusCircle, History, Calculator, Gift, Settings, TrendingUp, type Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { memo } from "react"

interface NavItem {
  href: string
  label: string
  icon: Icon
}

// Movido para fora do componente para evitar recriação
const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/registro", label: "Registrar", icon: PlusCircle },
  { href: "/historico", label: "Histórico", icon: History },
  { href: "/acompanhamento", label: "Banca", icon: TrendingUp },
  { href: "/calculadoras", label: "Cálculos", icon: Calculator },
  { href: "/freebets", label: "FreeBets", icon: Gift },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
]

// Criar componente de item de navegação separado para reduzir re-renderizações
const NavItemComponent = memo(function NavItemComponent({
  item,
  isActive,
}: {
  item: NavItem
  isActive: boolean
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group inline-flex flex-col items-center justify-center px-1 text-xs font-medium",
        isActive
          ? "text-primary dark:text-theme-dark-primary"
          : "text-muted-foreground hover:text-foreground dark:hover:text-theme-dark-text",
      )}
    >
      <item.icon className={cn("mb-1 h-4 w-4", isActive ? "text-primary dark:text-theme-dark-primary" : "")} />
      <span className="truncate text-[10px]">{item.label}</span>
    </Link>
  )
})

function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm dark:bg-theme-dark-card/95">
      <div className="mx-auto grid h-16 max-w-md grid-cols-7">
        {navItems.map((item) => {
          const isActive =
            (pathname === "/" && item.href === "/") ||
            (item.href !== "/" && pathname.startsWith(item.href.split("/").slice(0, -1).join("/") || item.href))
          return <NavItemComponent key={item.label} item={item} isActive={isActive} />
        })}
      </div>
    </nav>
  )
}

export default memo(BottomNav)
