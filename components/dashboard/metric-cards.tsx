"use client"

import { useEffect, useState } from "react"
import { getDashboard } from "@/lib/api"

export function StatsCards() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const result = await getDashboard()
      setData(result)
    }

    load()
  }, [])

  if (!data) return <p>Carregando...</p>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="bg-zinc-900 p-4 rounded-xl">
        <p>VS HOJE</p>
        <h2 className="text-2xl font-bold">{data.hoje}</h2>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl">
        <p>TOTAL VS</p>
        <h2 className="text-2xl font-bold">{data.total}</h2>
      </div>

    </div>
  )
}
