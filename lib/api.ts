const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-svs-production.up.railway.app"

export interface RankingPlayer {
  usuario: string
  discord_id: string
  total: number
  avatar_url?: string
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
  avatar_url?: string
}

// Formata pontos (2.84G, 789M, 1.50K...)
export function formatPoints(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}G`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`
  }
  return value.toFixed(0)
}

// Tempo relativo
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

// Formata horário no timezone Brasil/São Paulo no formato "21:20hs"
export function formatBrazilTime(dateString: string): string {
  // A API retorna o timestamp em UTC (ex: "2026-05-09T20:36:50.256Z").
  // Convertemos esse instante para o fuso de Brasília (America/Sao_Paulo, UTC-3).
  // Formatos possíveis vindos do PostgreSQL:
  // 1. Com "Z" no final: "2026-05-09T20:36:50.256Z"      -> UTC
  // 2. Com offset:       "2026-05-09T17:36:50.256-03:00" -> já tem fuso
  // 3. Sem timezone:     "2026-05-09T20:36:50.256"       -> tratamos como UTC

  // Se a string não tiver indicador de fuso (Z ou ±hh:mm), assumimos UTC
  // adicionando "Z" para que o Date interprete o instante corretamente.
  const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(dateString)
  const normalized = hasTimezone ? dateString : `${dateString}Z`

  const date = new Date(normalized)

  if (!isNaN(date.getTime())) {
    const formatted = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date)
    return `${formatted}hs`
  }

  // Fallback para formatos não-ISO (ex: "17:50:50") — sem informação de data/fuso,
  // exibimos o horário como veio
  const timeOnlyMatch = dateString.match(/^(\d{2}):(\d{2})/)
  if (timeOnlyMatch) {
    const [, hours, minutes] = timeOnlyMatch
    return `${hours}:${minutes}hs`
  }

  return dateString
}

export async function fetchRanking(period?: "day" | "all"): Promise<RankingPlayer[]> {
  const url = period ? `${API_URL}/ranking?period=${period}` : `${API_URL}/ranking`
  
  const response = await fetch(url, {
    next: { revalidate: 30 },
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
    throw new Error("Erro ao buscar dashboard")
  }
  
  return response.json()
}

export async function fetchRecentRecords(): Promise<RecentRecord[]> {
  const response = await fetch(`${API_URL}/recentes`, {
    next: { revalidate: 30 },
  })
  
  if (!response.ok) {
    throw new Error("Erro ao buscar registros")
  }
  
  return response.json()
}

// SWR / client
export const fetcher = async (url: string) => {
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error("Erro na requisição")
  }
  
  return response.json()
}

export { API_URL }
