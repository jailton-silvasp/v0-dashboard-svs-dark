const API_BASE = "https://api-svs-production.up.railway.app"

export async function getRanking() {
  try {
    const response = await fetch(`${API_BASE}/ranking`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Erro ao buscar ranking")
    }

    return await response.json()

  } catch (error) {
    console.error(error)
    return []
  }
}
