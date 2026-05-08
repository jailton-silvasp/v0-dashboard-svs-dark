"use client"

import { Trophy, Crown, User, ChevronRight } from "lucide-react"

const rankings = [
  { position: 1, name: "Jailton Silva", points: 965, isTop: true },
  { position: 2, name: "Gabriel Santos", points: 920, isTop: false },
  { position: 3, name: "Lucas Ferreira", points: 875, isTop: false },
  { position: 4, name: "Matheus Souza", points: 730, isTop: false },
  { position: 5, name: "Ryan Oliveira", points: 688, isTop: false },
  { position: 6, name: "Vinicius Lima", points: 645, isTop: false },
  { position: 7, name: "Felipe Rodrigues", points: 590, isTop: false },
  { position: 8, name: "Anderson Pereira", points: 560, isTop: false },
  { position: 9, name: "Leonardo Martins", points: 515, isTop: false },
  { position: 10, name: "Bruno Alves", points: 498, isTop: false },
]

function getPositionColor(position: number) {
  if (position === 1) return "text-[#c9a55c]"
  if (position === 2) return "text-gray-400"
  if (position === 3) return "text-amber-700"
  return "text-gray-500"
}

function getPositionBg(position: number) {
  if (position === 1) return "bg-[#c9a55c]/20"
  if (position === 2) return "bg-gray-400/10"
  if (position === 3) return "bg-amber-700/10"
  return ""
}

export function TopRanking() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 h-full transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-[#c9a55c]" />
        <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
          Top 10 Geral
        </h3>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_80px] gap-2 text-xs text-gray-500 uppercase tracking-wide pb-2 border-b border-[#2a2a2a]">
        <span className="text-center">#</span>
        <span>Jogador</span>
        <span className="text-right">Pontos</span>
      </div>

      {/* List */}
      <div className="space-y-1 mt-2">
        {rankings.map((player) => (
          <div
            key={player.position}
            className={`grid grid-cols-[40px_1fr_80px] gap-2 items-center py-2 px-1 rounded transition-all duration-200 hover:bg-[#2a2a2a] cursor-pointer group ${getPositionBg(player.position)}`}
          >
            <span className={`text-center font-bold ${getPositionColor(player.position)}`}>
              {player.position}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center">
                <User className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-white text-sm group-hover:text-[#c9a55c] transition-colors">
                {player.name}
              </span>
              {player.isTop && <Crown className="w-4 h-4 text-[#c9a55c]" />}
            </div>
            <div className="flex items-center justify-end gap-1">
              <span className={`font-bold text-sm ${player.isTop ? "text-[#c9a55c]" : "text-white"}`}>
                {player.points}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#c9a55c] transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button className="w-full mt-4 py-2 border border-[#2a2a2a] rounded-md text-gray-400 text-sm hover:border-[#c9a55c] hover:text-[#c9a55c] transition-all duration-200">
        VER RANKING COMPLETO
      </button>
    </div>
  )
}
