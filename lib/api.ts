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
  // A API insere com `NOW() AT TIME ZONE 'America/Sao_Paulo'`, então o horário
  // já está em horário do Brasil. Porém, o PostgreSQL pode retornar de diferentes formas:
  // 1. Com "Z" no final: "2026-05-09T17:50:50.256Z" 
  // 2. Sem timezone: "2026-05-09T17:50:50.256"
  // 3. Com offset: "2026-05-09T17:50:50.256-03:00"
  
  // Em todos os casos, o horário na string JÁ É o horário do Brasil,
  // então extraímos diretamente sem conversão de timezone
  
  // Extrai a parte do tempo (após o T)
  const match = dateString.match(/T(\d{2}):(\d{2})/)
  if (match) {
    const [, hours, minutes] = match
    return `${hours}:${minutes}hs`
  }
  
  // Fallback para formatos não-ISO (ex: "17:50:50")
  const timeOnlyMatch = dateString.match(/^(\d{2}):(\d{2})/)
  if (timeOnlyMatch) {
    const [, hours, minutes] = timeOnlyMatch
    return `${hours}:${minutes}hs`
  }
  
  // Último fallback: tenta extrair usando Date mas SEM conversão de timezone
  // Cria a data removendo qualquer indicador de timezone para evitar conversão
  const cleanDateString = dateString.replace(/Z$/, '').replace(/[+-]\d{2}:\d{2}$/, '')
  const date = new Date(cleanDateString)
  
  if (!isNaN(date.getTime())) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
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
