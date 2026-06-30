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

// F1 Semanal: usa a ultima pontuacao F1 informada por cada jogador.
// O endpoint /ranking?tipo=f1 nao zera na virada da semana, garantindo que o
// card sempre exiba o ultimo valor registrado de cada jogador.
export function useF1Semanal() {
  const { data, error, isLoading, mutate } = useSWR<RankingPlayer[]>(
    `${API_URL}/ranking?tipo=f1`,
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

// F1 por data: retorna a pontuacao F1 registrada na data selecionada
export function useF1ByDate(date: string | null) {
  const url = date ? `${API_URL}/ranking?period=day&tipo=f1&date=${date}` : null

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

// Ranking semanal geral (VS) - reseta ao término do sábado
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
