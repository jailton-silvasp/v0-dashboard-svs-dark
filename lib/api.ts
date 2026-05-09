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
  // A API retorna a data com "Z" (indicando UTC), mas o horário já está em 
  // horário do Brasil. Por isso, removemos o "Z" e tratamos como horário local.
  // Exemplo: "2026-05-09T17:50:50.256Z" -> o "17:50" já é o horário do Brasil
  
  // Remove o Z do final se existir, para evitar conversão de timezone
  const cleanDateString = dateString.replace('Z', '')
  
  // Extrai hora e minuto diretamente da string ISO
  const timePart = cleanDateString.split('T')[1]
  if (timePart) {
    const [hours, minutes] = timePart.split(':')
    return `${hours}:${minutes}hs`
  }
  
  // Fallback: se não conseguir extrair, usa o método padrão
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
    hour12: false
  }
  const time = date.toLocaleTimeString('pt-BR', options)
  return `${time}hs`
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
