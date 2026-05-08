"use client"

import useSWR from "swr"
import { API_URL, fetcher, type RankingPlayer, type DashboardData } from "@/lib/api"

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
