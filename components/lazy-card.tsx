"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Componente de Card com lazy loading para melhorar a performance
interface LazyCardProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
  loading?: boolean
  loadingHeight?: number
  delay?: number
}

export function LazyCard({
  header,
  footer,
  children,
  className = "",
  loading = false,
  loadingHeight = 200,
  delay = 0,
}: LazyCardProps) {
  const [isClient, setIsClient] = useState(false)
  const [isVisible, setIsVisible] = useState(delay === 0)

  useEffect(() => {
    setIsClient(true)
    if (delay > 0) {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [delay])

  if (loading || !isClient || !isVisible) {
    return (
      <Card className={className}>
        {header && (
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
        )}
        <CardContent>
          <Skeleton className={`w-full h-[${loadingHeight}px]`} />
        </CardContent>
        {footer && (
          <CardFooter>
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        )}
      </Card>
    )
  }

  return (
    <Card className={className}>
      {header}
      <CardContent>{children}</CardContent>
      {footer}
    </Card>
  )
}
