"use client"

import { Trophy, TrendingDown, User, X } from "lucide-react"
import { useState } from "react"
import { useRankingSemanalGeral } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPoints } from "@/lib/api"
import { useLanguage } from "@/contexts/language-context"

interface ChartData {
  name: string
  avatar_url?: string
  discord_id?: string
  points: number
}

interface ChartProps {
  title: string
  icon: React.ReactNode
  data: ChartData[]
  color: string
  subtitle: string
  isLoading?: boolean
  playerLabel: string
  pointsLabel: string
  noDataText: string
  invertBarScale?: boolean // Para menores pontos, inverte a escala das barras
  onViewFull: () => void
  viewFullLabel: string
  hasData: boolean
}

function HorizontalBarChart({ title, icon, data, color, subtitle, isLoading, playerLabel, pointsLabel, noDataText, invertBarScale, onViewFull, viewFullLabel, hasData }: ChartProps) {
  // Para menores pontos, usa o maior valor do array para calcular proporção das barras
  const maxPoints = data.length > 0
    ? (invertBarScale ? Math.max(...data.map(d => d.points)) : data[0].points)
    : 1

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
          {title}
        </h3>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[30px_1fr_70px] gap-2 text-xs text-gray-500 uppercase tracking-wide pb-2 border-b border-[#2a2a2a]">
        <span>#</span>
        <span>{playerLabel}</span>
        <span className="text-right">{pointsLabel}</span>
      </div>

      {/* Custom Bar List */}
      <div className="space-y-2 mt-3 flex-1">
        {isLoading ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="grid grid-cols-[30px_1fr_70px] gap-2 items-center">
              <Skeleton className="w-5 h-4 bg-[#2a2a2a]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 bg-[#2a2a2a]" style={{ width: `${100 - i * 8}%` }} />
              </div>
              <Skeleton className="w-10 h-4 bg-[#2a2a2a] ml-auto" />
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            {noDataText}
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="grid grid-cols-[30px_1fr_70px] gap-2 items-center group">
              <span className="text-gray-500 text-sm">{index + 1}</span>
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="h-4 rounded-r transition-all duration-300 group-hover:opacity-80 flex-shrink-0"
                  style={{
                    width: `${Math.min((item.points / maxPoints) * 50, 50)}%`,
                    backgroundColor: color,
                    minWidth: '20px'
                  }}
                />
                <span className="text-gray-400 text-xs truncate flex-1">{item.name}</span>
              </div>
              <span className="text-white text-sm text-right font-medium">
                {formatPoints(item.points)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#2a2a2a]">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>

      {/* View Full Button */}
      <button
        onClick={onViewFull}
        disabled={!hasData}
        className="w-full mt-4 py-2 border border-[#2a2a2a] rounded-md text-gray-400 text-sm hover:border-[#c9a55c] hover:text-[#c9a55c] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {viewFullLabel}
      </button>
    </div>
  )
}

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon: React.ReactNode
  data: ChartData[]
  playerLabel: string
  pointsLabel: string
  totalLabel: string
}

function ChartModal({ isOpen, onClose, title, icon, data, playerLabel, pointsLabel, totalLabel }: ChartModalProps) {
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
            {icon}
            <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
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
          <span>{playerLabel}</span>
          <span className="text-right">{pointsLabel}</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-[#2a2a2a]">
            {data.map((player, index) => {
              const position = index + 1

              return (
                <div
                  key={`${player.discord_id || player.name}-${index}`}
                  className="grid grid-cols-[50px_1fr_100px] sm:grid-cols-[60px_1fr_120px] gap-2 items-center px-4 sm:px-6 py-3 hover:bg-[#2a2a2a] transition-colors"
                >
                  <span className="text-center font-bold text-sm text-gray-500">
                    {position}
                  </span>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {player.avatar_url ? (
                        <img
                          src={player.avatar_url}
                          alt={player.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                    </div>

                    <span className="text-white text-sm truncate">
                      {player.name}
                    </span>
                  </div>

                  <span className="font-bold text-sm text-right text-white">
                    {formatPoints(player.points)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#2a2a2a] bg-[#0d0d0d]">
          <p className="text-center text-gray-500 text-sm">
            {totalLabel.replace("{count}", String(data.length))}
          </p>
        </div>
      </div>
    </>
  )
}

export function TopCharts() {
  const { ranking, isLoading } = useRankingSemanalGeral()
  const { t } = useLanguage()
  const [openModal, setOpenModal] = useState<"maiores" | "menores" | null>(null)

  // Ordenacao base do ranking semanal completo (do maior para o menor)
  const maioresFull: ChartData[] = [...ranking]
    .sort((a, b) => b.total - a.total)
    .map(p => ({
      name: p.usuario,
      avatar_url: p.avatar_url,
      discord_id: p.discord_id,
      points: p.total,
    }))

  // Menores pontos: ordena do menor para o maior (10 piores reais da semana)
  const menoresFull: ChartData[] = [...ranking]
    .sort((a, b) => a.total - b.total)
    .map(p => ({
      name: p.usuario,
      avatar_url: p.avatar_url,
      discord_id: p.discord_id,
      points: p.total,
    }))

  const maioresPontosData = maioresFull.slice(0, 10)
  const menoresPontosData = menoresFull.slice(0, 10)

  const dateLabel = t.thisWeek

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <HorizontalBarChart
        title={t.top10HighestPoints}
        icon={<Trophy className="w-5 h-5 text-[#c9a55c]" />}
        data={maioresPontosData}
        color="#c9a55c"
        subtitle={`${t.highestScoresOf} ${dateLabel}`}
        isLoading={isLoading}
        playerLabel={t.player}
        pointsLabel={t.points}
        noDataText={t.noDataAvailable}
        onViewFull={() => setOpenModal("maiores")}
        viewFullLabel={t.viewFullRanking}
        hasData={maioresFull.length > 0}
      />
      <HorizontalBarChart
        title={t.top10LatestPoints}
        icon={<TrendingDown className="w-5 h-5 text-[#c9a55c]" />}
        data={menoresPontosData}
        color="#c9a55c"
        subtitle={`${t.latestRecordsOf} ${dateLabel}`}
        isLoading={isLoading}
        playerLabel={t.player}
        pointsLabel={t.points}
        noDataText={t.noDataAvailable}
        invertBarScale={true}
        onViewFull={() => setOpenModal("menores")}
        viewFullLabel={t.viewFullRanking}
        hasData={menoresFull.length > 0}
      />

      <ChartModal
        isOpen={openModal === "maiores"}
        onClose={() => setOpenModal(null)}
        title={t.highestPointsFull}
        icon={<Trophy className="w-6 h-6 text-[#c9a55c]" />}
        data={maioresFull}
        playerLabel={t.player}
        pointsLabel={t.points}
        totalLabel={t.totalPlayersInRanking}
      />
      <ChartModal
        isOpen={openModal === "menores"}
        onClose={() => setOpenModal(null)}
        title={t.lowestPointsFull}
        icon={<TrendingDown className="w-6 h-6 text-[#c9a55c]" />}
        data={menoresFull}
        playerLabel={t.player}
        pointsLabel={t.points}
        totalLabel={t.totalPlayersInRanking}
      />
    </div>
  )
}
