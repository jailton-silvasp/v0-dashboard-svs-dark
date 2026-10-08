"use client"

import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { API_URL, fetcher, toFiniteNumber, type RankingPlayer, type DashboardData, type RecentRecord } from "@/lib/api"

export type Estrutura = "Principal" | "Academy"

function useEstrutura() {
  const searchParams = useSearchParams()
  const value = searchParams.get("estrutura")
  return value === "Principal" || value === "Academy" ? value : undefined
}

function withEstrutura(url: string, estrutura?: Estrutura) {
  return estrutura ? `${url}${url.includes("?") ? "&" : "?"}estrutura=${encodeURIComponent(estrutura)}` : url
}

export function useRanking(period?: "day" | "all") {
  const estrutura = useEstrutura()
  const url = withEstrutura(period ? `${API_URL}/ranking?period=${period}` : `${API_URL}/ranking`, estrutura)
  
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
  const estrutura = useEstrutura()
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    withEstrutura(`${API_URL}/dashboard`, estrutura),
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
  const estrutura = useEstrutura()
  const { data, error, isLoading, mutate } = useSWR<RecentRecord[]>(
    withEstrutura(`${API_URL}/recentes`, estrutura),
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
  const estrutura = useEstrutura()
  const { data, error, isLoading, mutate } = useSWR<{ vs: RankingPlayer[] } | RankingPlayer[]>(
    withEstrutura(`${API_URL}/ranking/semanal?tipo=vs`, estrutura),
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
  const estrutura = useEstrutura()
  const { data, error, isLoading, mutate } = useSWR<{ f1: RankingPlayer[] } | RankingPlayer[]>(
    withEstrutura(`${API_URL}/ranking/semanal?tipo=f1`, estrutura),
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
  const estrutura = useEstrutura()
  const { data, error, isLoading, mutate } = useSWR<{ vs: RankingPlayer[] } | RankingPlayer[]>(
    withEstrutura(`${API_URL}/ranking/semanal?tipo=vs`, estrutura),
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
  const estrutura = useEstrutura()
  const dates = getWeekDates()
  const key = `vs-evolucao-semanal-${dates[0]}-${estrutura ?? "geral"}`

  const { data, error, isLoading, mutate } = useSWR<DayVsTotal[]>(
    key,
    async () => {
      const results = await Promise.all(
        dates.map(async (date): Promise<DayVsTotal> => {
          try {
            const url = withEstrutura(`${API_URL}/ranking?period=day&date=${date}`, estrutura)
            const res = await fetch(url)
            if (!res.ok) return { date, total: 0 }
            const players: RankingPlayer[] = await res.json()
            const total = Array.isArray(players)
              ? players.reduce((sum, p) => sum + toFiniteNumber(p.total), 0)
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
  const estrutura = useEstrutura()
  const url = date ? withEstrutura(`${API_URL}/ranking?period=day&date=${date}`, estrutura) : null
  
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
