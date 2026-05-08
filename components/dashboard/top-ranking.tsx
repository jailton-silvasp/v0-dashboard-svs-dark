"use client"

import { useEffect, useState } from "react"
import { getRanking } from "@/lib/api"

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
      const data = await getRanking()
      setPlayers(data)
      setLoading(false)
    }

    load()
  }, [])

  function formatarNumero(valor: number) {
    return valor.toFixed(2) + "M"
  }

  return (
    <div className="bg-zinc-900 p-4 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">TOP 10 GERAL</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th>#</th>
              <th>Jogador</th>
              <th>Pontos</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.discord_id}>
                <td>{index + 1}</td>
                <td>{player.usuario}</td>
                <td>{formatarNumero(player.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
