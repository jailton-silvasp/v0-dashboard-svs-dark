"use client"

import useSWR from "swr"
import { API_URL, fetcher, toFiniteNumber, type RankingPlayer, type DashboardData, type RecentRecord } from "@/lib/api"

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
  const { data, error, isLoading, mutate } = useSWR<{ vs: RankingPlayer[] } | RankingPlayer[]>(
    `${API_URL}/ranking/semanal?tipo=vs`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    ranking: Array.isArray(data) ? data : (data?.vs ?? []),
    isLoading,
    isError: error,
    mutate,
  }
}

export function useF1Semanal() {
  const { data, error, isLoading, mutate } = useSWR<{ f1: RankingPlayer[] } | RankingPlayer[]>(
    `${API_URL}/ranking/semanal?tipo=f1`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    ranking: Array.isArray(data) ? data : (data?.f1 ?? []),
    isLoading,
    isError: error,
    mutate,
  }
}

// Ranking semanal geral (VS) - reseta toda segunda-feira 00:00 (America/Sao_Paulo)
export function useRankingSemanalGeral() {
  const { data, error, isLoading, mutate } = useSWR<{ vs: RankingPlayer[] } | RankingPlayer[]>(
    `${API_URL}/ranking/semanal?tipo=vs`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  return {
    ranking: Array.isArray(data) ? data : (data?.vs ?? []),
    isLoading,
    isError: error,
    mutate,
  }
}

// Retorna as 6 datas (ISO YYYY-MM-DD) do ciclo atual do VS (segunda a sábado).
// Domingo é folga (sem atividade). O ciclo encerra no sábado 23h Brasília.
export function getWeekDates(): string[] {
  const now = new Date()
  const spNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
  const dayOfWeek = spNow.getDay() // 0=Dom ... 6=Sáb

  // Domingo mantém a semana encerrada até 22h59.
  // Às 23h de domingo, a data lógica já é segunda e o novo ciclo começa.
  const isSundayAfterReset = dayOfWeek === 0 && spNow.getHours() >= 23
  const daysSinceMonday = isSundayAfterReset ? 0 : dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const startMonday = new Date(spNow)
  startMonday.setDate(spNow.getDate() - daysSinceMonday)

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
          const url = `${API_URL}/ranking?period=day&date=${date}`
          const res = await fetch(url)
          if (!res.ok) {
            throw new Error(`Falha ao consultar VS de ${date}: HTTP ${res.status}`)
          }

          const players: RankingPlayer[] = await res.json()
          const total = Array.isArray(players)
            ? players.reduce((sum, p) => sum + toFiniteNumber(p.total), 0)
            : 0

          return { date, total }
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
