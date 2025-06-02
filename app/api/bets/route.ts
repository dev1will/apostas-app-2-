import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import supabase from '@/lib/supabase'

// Função auxiliar para validar o token de autenticação
async function validateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return { error: 'Não autorizado', status: 401 }
  }
  
  const token = authHeader.split(' ')[1]
  const { data: userData, error } = await supabase.auth.getUser(token)
  
  if (error || !userData.user) {
    return { error: 'Não autorizado', status: 401 }
  }
  
  return { userId: userData.user.id }
}

// Criar uma nova aposta
export async function POST(request: NextRequest) {
  try {
    const auth = await validateToken(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    
    const data = await request.json()
    
    const bet = await prisma.bet.create({
      data: {
        value: data.value,
        date: new Date(data.date),
        type: data.type,
        bettingHouse: data.bettingHouse,
        isProfit: data.isProfit,
        profitType: data.profitType,
        userId: auth.userId!,
      },
    })
    
    return NextResponse.json(bet)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Buscar todas as apostas do usuário
export async function GET(request: NextRequest) {
  try {
    const auth = await validateToken(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    
    const bets = await prisma.bet.findMany({
      where: {
        userId: auth.userId!,
      },
      orderBy: {
        date: 'desc',
      },
    })
    
    return NextResponse.json(bets)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 