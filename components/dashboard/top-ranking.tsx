"use client"

import { Trophy, Crown, User, ChevronRight, X, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useRankingSemanalGeral } from "@/hooks/use-api"
import { formatPoints } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"

// Calcula a data de reset da semana (domingo as 00:00 horario do servidor = sabado 23:00 Brasil)
function getWeekResetInfo(locale: string): { daysLeft: number; resetDate: string } {
  const now = new Date()
  // Ajusta para timezone Brasil (UTC-3)
  const brasilOffset = -3 * 60
  const localOffset = now.getTimezoneOffset()
  const brasilNow = new Date(now.getTime() + (localOffset + brasilOffset) * 60000)
  
  const dayOfWeek = brasilNow.getDay() // 0 = domingo, 6 = sabado
  const hour = brasilNow.getHours()
  
  // Se for sabado apos 23h, conta como novo ciclo (0 dias restantes)
  let daysUntilSaturday23h: number
  if (dayOfWeek === 6 && hour >= 23) {
    daysUntilSaturday23h = 7 // proximo sabado
  } else if (dayOfWeek === 6) {
    daysUntilSaturday23h = 0 // ainda e sabado antes das 23h
  } else {
    // Dias ate sabado
    daysUntilSaturday23h = (6 - dayOfWeek)
  }
  
  const resetDate = new Date(brasilNow)
  resetDate.setDate(resetDate.getDate() + daysUntilSaturday23h)
  resetDate.setHours(23, 0, 0, 0)
  
  const resetDateStr = resetDate.toLocaleDateString(locale, { 
    weekday: 'short', 
    day: '2-digit', 
    month: '2-digit' 
  })
  
  return { daysLeft: daysUntilSaturday23h, resetDate: resetDateStr }
}

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

interface RankingModalProps {
  isOpen: boolean
  onClose: () => void
  ranking: Array<{
    discord_id?: string
    usuario: string
    avatar_url?: string
    total: number
  }>
  translations: {
    weeklyRankingFull: string
    player: string
    points: string
    totalPlayersInRanking: string
  }
}

function RankingModal({ isOpen, onClose, ranking, translations }: RankingModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 sm:inset-10 md:inset-20 lg:inset-y-10 lg:inset-x-40 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-[#c9a55c]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">{translations.weeklyRankingFull}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#c9a55c] transition-colors rounded-lg hover:bg-[#2a2a2a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[50px_1fr_100px] sm:grid-cols-[60px_1fr_120px] gap-2 px-4 sm:px-6 py-3 text-xs text-gray-500 uppercase tracking-wide border-b border-[#2a2a2a] bg-[#0d0d0d]">
          <span className="text-center">#</span>
          <span>{translations.player}</span>
          <span className="text-right">{translations.points}</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-[#2a2a2a]">
            {ranking.map((player, index) => {
              const position = index + 1
              const isTop = position === 1

              return (
                <div
                  key={`${player.discord_id || player.usuario}-${index}`}
                  className={`grid grid-cols-[50px_1fr_100px] sm:grid-cols-[60px_1fr_120px] gap-2 items-center px-4 sm:px-6 py-3 hover:bg-[#2a2a2a] transition-colors ${getPositionBg(position)}`}
                >
                  <span className={`text-center font-bold text-sm ${getPositionColor(position)}`}>
                    {position}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {player.avatar_url ? (
                        <img
                          src={player.avatar_url}
                          alt={player.usuario}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                    </div>

                    <span className="text-white text-sm truncate">
                      {player.usuario}
                    </span>

                    {isTop && (
                      <Crown className="w-4 h-4 text-[#c9a55c] flex-shrink-0" />
                    )}
                  </div>

                  <span className={`font-bold text-sm text-right ${isTop ? "text-[#c9a55c]" : "text-white"}`}>
                    {formatPoints(player.total)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#2a2a2a] bg-[#0d0d0d]">
          <p className="text-center text-gray-500 text-sm">
            {translations.totalPlayersInRanking.replace("{count}", String(ranking.length))}
          </p>
        </div>
      </div>
    </>
  )
}

export function TopRanking() {
  const { ranking, isLoading, isError } = useRankingSemanalGeral()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [resetInfo, setResetInfo] = useState<{ daysLeft: number; resetDate: string } | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    setResetInfo(getWeekResetInfo(t.dateLocale))
    // Atualiza a cada minuto
    const interval = setInterval(() => {
      setResetInfo(getWeekResetInfo(t.dateLocale))
    }, 60000)
    return () => clearInterval(interval)
  }, [t.dateLocale])

  const top10 = ranking.slice(0, 10)

  return (
    <>
      <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#c9a55c]" />
            {t.top10Weekly}
          </h2>
          {resetInfo && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.reset} {resetInfo.resetDate}</span>
              <span className="text-[#c9a55c]">({resetInfo.daysLeft}{t.days})</span>
            </div>
          )}
        </div>

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
              {t.errorLoadingRanking}
            </div>
          ) : top10.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t.noPlayersInRanking}
            </div>
          ) : (
            top10.map((player, index) => {
              const position = index + 1
              const isTop = position === 1

              return (
                <div
                  key={`${player.discord_id || player.usuario}-${index}`}
                  className={`grid grid-cols-[40px_1fr_80px] gap-2 items-center py-2 px-1 rounded transition-all duration-200 hover:bg-[#2a2a2a] cursor-pointer group ${getPositionBg(position)}`}
                >
                  <span className={`text-center font-bold ${getPositionColor(position)}`}>
                    {position}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center overflow-hidden">
                      {player.avatar_url ? (
                        <img
                          src={player.avatar_url}
                          alt={player.usuario}
                          width={28}
                          height={28}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                    </div>

                    <span className="text-white text-sm group-hover:text-[#c9a55c] transition-colors truncate">
                      {player.usuario}
                    </span>

                    {isTop && (
                      <Crown className="w-4 h-4 text-[#c9a55c] flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <span className={`font-bold text-sm ${isTop ? "text-[#c9a55c]" : "text-white"}`}>
                      {formatPoints(player.total)}
                    </span>

                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#c9a55c] transition-colors" />
                  </div>
                </div>
              )
            })
          )}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={ranking.length === 0}
          className="w-full mt-4 py-2 border border-[#2a2a2a] rounded-md text-gray-400 text-sm hover:border-[#c9a55c] hover:text-[#c9a55c] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.viewFullRanking}
        </button>
      </div>

      <RankingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        ranking={ranking}
        translations={{
          weeklyRankingFull: t.weeklyRankingFull,
          player: t.player,
          points: t.points,
          totalPlayersInRanking: t.totalPlayersInRanking,
        }}
      />
    </>
  )
}
