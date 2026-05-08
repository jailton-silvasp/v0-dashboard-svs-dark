"use client"

import { useEffect, useState } from "react"

type DashboardData = {
  hoje: number
  total: number
}

export function MetricCards() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "https://api-svs-production.up.railway.app/dashboard"
        )

        const result = await response.json()
        setData(result)

      } catch (error) {
        console.error("Erro ao carregar métricas:", error)
      }
    }

    load()
  }, [])

  if (!data) {
    return <p className="text-zinc-400">Carregando...</p>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <p className="text-zinc-400">VS HOJE</p>
        <h2 className="text-2xl font-bold text-white">
          {data.hoje}
        </h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
        <p className="text-zinc-400">TOTAL VS</p>
        <h2 className="text-2xl font-bold text-white">
          {data.total}
        </h2>
      </div>

    </div>
  )
}
