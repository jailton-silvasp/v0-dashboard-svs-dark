const API_BASE = "https://api-svs-production.up.railway.app"

export async function getRanking(period?: string) {
  try {
    const url = period
      ? `${API_BASE}/ranking?period=${period}`
      : `${API_BASE}/ranking`

    const response = await fetch(url, {
      cache: "no-store"
    })

    if (!response.ok) {
      throw new Error("Erro ao buscar ranking")
    }

    return await response.json()

  } catch (error) {
    console.error("Erro API:", error)
    return []
  }
}

export async function getDashboard() {
  try {
    const response = await fetch(`${API_BASE}/dashboard`, {
      cache: "no-store"
    })

    if (!response.ok) {
      throw new Error("Erro ao buscar dashboard")
    }

    return await response.json()

  } catch (error) {
    console.error("Erro API:", error)
    return null
  }
}
