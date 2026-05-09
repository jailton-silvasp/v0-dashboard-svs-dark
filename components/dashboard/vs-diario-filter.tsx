"use client"

import { Swords, User, Crown, ChevronRight, Loader2 } from "lucide-react"
import { useState, useMemo } from "react"
import { useRankingByDate } from "@/hooks/use-api"
import { formatPoints } from "@/lib/api"

// Calcula a data do "dia atual" considerando que após 23h conta como dia seguinte
// (meia noite no servidor = 23h Brasil)
function getServerDate(): string {
  const now = new Date()
  // Ajusta para timezone Brasil (UTC-3)
  const brasilOffset = -3 * 60
  const localOffset = now.getTimezoneOffset()
  const brasilNow = new Date(now.getTime() + (localOffset + brasilOffset) * 60000)
  
  const hour = brasilNow.getHours()
  
  // Se for após 23h, considera como próximo dia
  if (hour >= 23) {
    const nextDay = new Date(brasilNow)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay.toISOString().split('T')[0]
  }
  
  return brasilNow.toISOString().split('T')[0]
}

interface VsDiarioFilterProps {
  onDateChange?: (date: string | null) => void
}

export function VsDiarioFilter({ onDateChange }: VsDiarioFilterProps) {
  const today = useMemo(() => getServerDate(), [])
  const [date, setDate] = useState(today)
  const [filterDate, setFilterDate] = useState<string | null>(null)
  
  const { ranking, isLoading } = useRankingByDate(filterDate)
  const top3 = ranking.slice(0, 3)

  const handleFilter = () => {
    setFilterDate(date)
    onDateChange?.(date)
  }

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center gap-2 mb-4">
        <Swords className="w-5 h-5 text-[#c9a55c]" />
        <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
          VS Diário
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

      {/* Resultados do filtro - Top 3 */}
      {filterDate && (
        <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
          <h4 className="text-xs text-gray-500 uppercase mb-3">
            Resultados de {formatDisplayDate(filterDate)}
          </h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#c9a55c]" />
            </div>
          ) : ranking.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Nenhum registro encontrado para esta data
            </p>
          ) : (
            <div className="space-y-2">
              {top3.map((player, index) => (
                <div
                  key={`${player.discord_id || player.usuario}-${index}`}
                  className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#2a2a2a] transition-colors group"
                >
                  <span className={`text-xs font-bold w-5 ${index === 0 ? 'text-[#c9a55c]' : index === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
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
