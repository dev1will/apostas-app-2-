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

// Criar ou atualizar metas
export async function POST(request: NextRequest) {
  try {
    const auth = await validateToken(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    
    const data = await request.json()
    
    // Verificar se o usuário já tem metas definidas
    const existingGoal = await prisma.goal.findFirst({
      where: {
        userId: auth.userId!,
      },
    })
    
    let goal
    
    if (existingGoal) {
      // Atualizar metas existentes
      goal = await prisma.goal.update({
        where: {
          id: existingGoal.id,
        },
        data: {
          dailyProfitGoal: data.dailyProfitGoal,
          dailyEntriesGoal: data.dailyEntriesGoal,
          monthlyProfitGoal: data.monthlyProfitGoal,
        },
      })
    } else {
      // Criar novas metas
      goal = await prisma.goal.create({
        data: {
          dailyProfitGoal: data.dailyProfitGoal,
          dailyEntriesGoal: data.dailyEntriesGoal,
          monthlyProfitGoal: data.monthlyProfitGoal,
          userId: auth.userId!,
        },
      })
    }
    
    return NextResponse.json(goal)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Buscar metas do usuário
export async function GET(request: NextRequest) {
  try {
    const auth = await validateToken(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    
    const goal = await prisma.goal.findFirst({
      where: {
        userId: auth.userId!,
      },
    })
    
    return NextResponse.json(goal || {
      dailyProfitGoal: 100,
      dailyEntriesGoal: 5,
      monthlyProfitGoal: 2000,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 