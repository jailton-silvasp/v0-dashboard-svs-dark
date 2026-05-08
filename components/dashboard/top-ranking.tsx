"use client"

import { Trophy, Crown, User, ChevronRight } from "lucide-react"
import { useRanking } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

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
  const { ranking, isLoading, isError } = useRanking()

  const top10 = ranking.slice(0, 10)

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
        {isLoading ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-[40px_1fr_80px] gap-2 items-center py-2 px-1">
              <Skeleton className="w-6 h-6 rounded bg-[#2a2a2a] mx-auto" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-7 h-7 rounded-full bg-[#2a2a2a]" />
                <Skeleton className="w-24 h-4 bg-[#2a2a2a]" />
              </div>
              <Skeleton className="w-12 h-4 bg-[#2a2a2a] ml-auto" />
            </div>
          ))
        ) : isError ? (
          <div className="text-center py-8 text-gray-500">
            Erro ao carregar ranking
          </div>
        ) : top10.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum jogador no ranking
          </div>
        ) : (
          top10.map((player, index) => {
            const position = index + 1
            const isTop = position === 1
            return (
              <div
                key={player.discord_id || player.usuario}
                className={`grid grid-cols-[40px_1fr_80px] gap-2 items-center py-2 px-1 rounded transition-all duration-200 hover:bg-[#2a2a2a] cursor-pointer group ${getPositionBg(position)}`}
              >
                <span className={`text-center font-bold ${getPositionColor(position)}`}>
                  {position}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-white text-sm group-hover:text-[#c9a55c] transition-colors truncate">
                    {player.usuario}
                  </span>
                  {isTop && <Crown className="w-4 h-4 text-[#c9a55c] flex-shrink-0" />}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className={`font-bold text-sm ${isTop ? "text-[#c9a55c]" : "text-white"}`}>
                    {Math.round(player.total).toLocaleString('pt-BR')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#c9a55c] transition-colors" />
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* View All Button */}
      <button className="w-full mt-4 py-2 border border-[#2a2a2a] rounded-md text-gray-400 text-sm hover:border-[#c9a55c] hover:text-[#c9a55c] transition-all duration-200">
        VER RANKING COMPLETO
      </button>
    </div>
  )
}
