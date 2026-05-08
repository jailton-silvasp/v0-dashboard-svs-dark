"use client"

import { useEffect, useState } from "react"

type Player = {
  usuario: string
  discord_id: string
  total: number
}

export function TopRanking() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "https://api-svs-production.up.railway.app/ranking"
        )

        const data = await response.json()
        setPlayers(data)

      } catch (error) {
        console.error("Erro:", error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function formatarNumero(valor: number) {
    if (valor >= 1_000_000) {
      return (valor / 1_000_000).toFixed(2) + "M"
    }
    if (valor >= 1_000) {
      return (valor / 1_000).toFixed(1) + "K"
    }
    return valor.toString()
  }

  return (
    <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800">
      <h2 className="text-lg font-semibold mb-4 text-white">
        TOP 10 GERAL
      </h2>

      {loading ? (
        <p className="text-zinc-400">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={player.discord_id}
              className="flex items-center justify-between bg-zinc-950 px-4 py-3 rounded-xl border border-zinc-800"
            >
              <div className="flex items-center gap-4">
                <span className="text-zinc-400 w-4">
                  {index + 1}
                </span>

                <span className="text-white font-medium">
                  {player.usuario}
                </span>
              </div>

              <span className="text-blue-400 font-semibold">
                {formatarNumero(player.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
