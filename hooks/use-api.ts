"use client"

import useSWR from "swr"
import { API_URL, fetcher, type RankingPlayer, type DashboardData, type RecentRecord } from "@/lib/api"

export function useRanking(period?: "day" | "all") {
  const url = period ? `${API_URL}/ranking?period=${period}` : `${API_URL}/ranking`
  
  const { data, error, isLoading, mutate } = useSWR<RankingPlayer[]>(url, fetcher, {
    refreshInterval: 30000, // Atualiza a cada 30 segundos
    revalidateOnFocus: true,
  })

  return {
    ranking: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    `${API_URL}/dashboard`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useRankingDiario() {
  return useRanking("day")
}

export function useRankingGeral() {
  return useRanking()
}

export function useRecentRecords() {
  const { data, error, isLoading, mutate } = useSWR<RecentRecord[]>(
    `${API_URL}/recentes`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    records: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useVsSemanal() {
  const { data, error, isLoading, mutate } = useSWR<RankingPlayer[]>(
    `${API_URL}/ranking/semanal?tipo=vs`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    ranking: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useF1Semanal() {
  const { data, error, isLoading, mutate } = useSWR<RankingPlayer[]>(
    `${API_URL}/ranking/semanal?tipo=f1`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    ranking: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Ranking semanal geral (VS) - reseta toda segunda-feira 00:00 (America/Sao_Paulo)
export function useRankingSemanalGeral() {
  const { data, error, isLoading, mutate } = useSWR<RankingPlayer[]>(
    `${API_URL}/ranking/semanal?tipo=vs`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    ranking: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Retorna as 6 datas (ISO YYYY-MM-DD) do ciclo atual do VS (segunda a sábado).
// Domingo é folga (sem atividade). O ciclo encerra no sábado 23h Brasília.
export function getWeekDates(): string[] {
  const now = new Date()
  // "Agora" no fuso de Brasília
  const spNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
  const dayOfWeek = spNow.getDay() // 0=Dom ... 6=Sáb
  const hour = spNow.getHours()

  // Quantos dias até o sábado que encerra o ciclo (mesma lógica do TopRanking)
  let daysUntilSaturday: number
  if (dayOfWeek === 6 && hour >= 23) {
    daysUntilSaturday = 7 // já virou o ciclo, encerra no próximo sábado
  } else if (dayOfWeek === 6) {
    daysUntilSaturday = 0
  } else {
    daysUntilSaturday = 6 - dayOfWeek
  }

  // Sábado que encerra o ciclo atual
  const endSaturday = new Date(spNow)
  endSaturday.setDate(spNow.getDate() + daysUntilSaturday)

  // Segunda-feira que inicia o ciclo (5 dias antes do sábado)
  const startMonday = new Date(endSaturday)
  startMonday.setDate(endSaturday.getDate() - 5)

  const dates: string[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(startMonday)
    d.setDate(startMonday.getDate() + i)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    dates.push(iso)
  }
  return dates
}

export interface DayVsTotal {
  date: string
  total: number
}

// Agrega o total de VS por dia da semana fazendo 7 chamadas ao ranking diário
export function useVsEvolucaoSemanal() {
  const dates = getWeekDates()
  const key = `vs-evolucao-semanal-${dates[0]}`

  const { data, error, isLoading, mutate } = useSWR<DayVsTotal[]>(
    key,
    async () => {
      const results = await Promise.all(
        dates.map(async (date): Promise<DayVsTotal> => {
          try {
            const res = await fetch(`${API_URL}/ranking?period=day&date=${date}`)
            if (!res.ok) return { date, total: 0 }
            const players: RankingPlayer[] = await res.json()
            const total = Array.isArray(players)
              ? players.reduce((sum, p) => sum + (p.total || 0), 0)
              : 0
            return { date, total }
          } catch {
            return { date, total: 0 }
          }
        })
      )
      return results
    },
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  )

  return {
    data: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useRankingByDate(date: string | null) {
  const url = date ? `${API_URL}/ranking?period=day&date=${date}` : null
  
  const { data, error, isLoading, mutate } = useSWR<RankingPlayer[]>(
    url,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    ranking: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}
