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

export interface RecentRecord {
  usuario: string
  valor: number
  criado_em: string
}

// Formata pontos no formato abreviado (ex: 37.20M, 1.50K)
export function formatPoints(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`
  }
  return value.toFixed(0)
}

// Formata tempo relativo (ex: "há 2 minutos")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 1) return "agora"
  if (diffMins < 60) return `há ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`
  if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
  return `há ${Math.floor(diffHours / 24)} dias`
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

export async function fetchRecentRecords(): Promise<RecentRecord[]> {
  const response = await fetch(`${API_URL}/recentes`, {
    next: { revalidate: 30 },
  })
  
  if (!response.ok) {
    throw new Error("Erro ao buscar últimos registros")
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
