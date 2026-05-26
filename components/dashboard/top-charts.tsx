"use client"

import { Trophy, Clock } from "lucide-react"
import { useRankingDiario, useRankingByDate } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPoints } from "@/lib/api"
import { useLanguage } from "@/contexts/language-context"

interface ChartData {
  name: string
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
}

interface TopChartsProps {
  selectedDate?: string | null
}

function HorizontalBarChart({ title, icon, data, color, subtitle, isLoading, playerLabel, pointsLabel, noDataText }: ChartProps) {
  const maxPoints = data.length > 0 ? data[0].points : 1

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
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
      <div className="space-y-2 mt-3">
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
    </div>
  )
}

export function TopCharts({ selectedDate }: TopChartsProps) {
  const { ranking: rankingDiario, isLoading: isLoadingDiario } = useRankingDiario()
  const { ranking: rankingByDate, isLoading: isLoadingByDate } = useRankingByDate(selectedDate ?? null)
  const { t } = useLanguage()

  // Para ambos os cards: usa data selecionada ou ranking diário
  const currentRanking = selectedDate 
    ? rankingByDate 
    : rankingDiario
  
  const isLoading = selectedDate 
    ? isLoadingByDate 
    : isLoadingDiario

  // Top 10 Geral - Maiores Pontos (10 maiores pontuadores, do maior ao menor)
  const maioresPontosData: ChartData[] = [...currentRanking]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(p => ({
      name: p.usuario,
      points: p.total
    }))

  // Top 10 Geral - Últimos Pontos (10 menores pontuadores, do maior ao menor)
  const ultimosPontosData: ChartData[] = [...currentRanking]
    .sort((a, b) => b.total - a.total)
    .filter((_, index, arr) => index >= arr.length - 10)
    .map(p => ({
      name: p.usuario,
      points: p.total
    }))

  const dateLabel = selectedDate 
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString(t.dateLocale, { day: '2-digit', month: '2-digit', year: 'numeric' })
    : t.today

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
      />
      <HorizontalBarChart
        title={t.top10LatestPoints}
        icon={<Clock className="w-5 h-5 text-[#c9a55c]" />}
        data={ultimosPontosData}
        color="#c9a55c"
        subtitle={`${t.latestRecordsOf} ${dateLabel}`}
        isLoading={isLoading}
        playerLabel={t.player}
        pointsLabel={t.points}
        noDataText={t.noDataAvailable}
      />
    </div>
  )
}
