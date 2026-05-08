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
