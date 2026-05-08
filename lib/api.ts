const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-svs-production.up.railway.app"

export interface RankingPlayer {
  usuario: string
  discord_id: string
  total: number
}

export interface DashboardData {
  hoje: number
  total: number
  ranking: {
    usuario: string
    total: number
  }[]
}

export async function fetchRanking(period?: "day" | "all"): Promise<RankingPlayer[]> {
  const url = period ? `${API_URL}/ranking?period=${period}` : `${API_URL}/ranking`
  const response = await fetch(url, {
    next: { revalidate: 30 }, // Cache por 30 segundos
  })
  
  if (!response.ok) {
    throw new Error("Erro ao buscar ranking")
  }
  
  return response.json()
}

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/dashboard`, {
    next: { revalidate: 30 },
  })
  
  if (!response.ok) {
    throw new Error("Erro ao buscar dados do dashboard")
  }
  
  return response.json()
}

// Função para uso client-side com SWR
export const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Erro na requisição")
  }
  return response.json()
}

export { API_URL }
