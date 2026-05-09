"use client"

import { Swords, User, Crown, ChevronRight, Loader2 } from "lucide-react"
import { useState } from "react"

import { useRankingByDate } from "@/hooks/use-api"
import { formatPoints } from "@/lib/api"

export function VsDiarioFilter() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [filterDate, setFilterDate] = useState<string | null>(null)
  
  const { ranking, isLoading } = useRankingByDate(filterDate)

  const handleFilter = () => {
    setFilterDate(date)
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center gap-2 mb-4">
        <Swords className="w-5 h-5 text-[#c9a55c]" />
        <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
          VS Diario
        </h3>
      </div>

      <div className="space-y-3">
        <label className="text-gray-400 text-xs">Selecione a data:</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm focus:border-[#c9a55c] focus:outline-none transition-colors [color-scheme:dark]"
            />
          </div>
          <button 
            onClick={handleFilter}
            disabled={isLoading}
            className="bg-[#c9a55c] text-[#0d0d0d] px-6 py-2 rounded-md font-semibold text-sm hover:bg-[#d4b56d] transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "FILTRAR"
            )}
          </button>
        </div>
      </div>

      {/* Resultados do filtro */}
      {filterDate && (
        <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
          <h4 className="text-xs text-gray-500 uppercase mb-3">
            Resultados de {new Date(filterDate + 'T12:00:00').toLocaleDateString('pt-BR')}
          </h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#c9a55c]" />
            </div>
          ) : ranking.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Nenhum registro encontrado
            </p>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {ranking.slice(0, 5).map((player, index) => (
                <div
                  key={`${player.discord_id || player.usuario}-${index}`}
                  className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#2a2a2a] transition-colors group"
                >
                  <span className={`text-xs font-bold w-5 ${index === 0 ? 'text-[#c9a55c]' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                  
                  <div className="w-6 h-6 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center overflow-hidden">
                    {player.avatar_url ? (
                      <img
                        src={player.avatar_url}
                        alt={player.usuario}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-3 h-3 text-gray-500" />
                    )}
                  </div>
                  
                  <span className="text-white text-xs flex-1 truncate group-hover:text-[#c9a55c]">
                    {player.usuario}
                  </span>
                  
                  {index === 0 && (
                    <Crown className="w-3 h-3 text-[#c9a55c]" />
                  )}
                  
                  <span className={`text-xs font-medium ${index === 0 ? 'text-[#c9a55c]' : 'text-white'}`}>
                    {formatPoints(player.total)}
                  </span>
                  
                  <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-[#c9a55c]" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
