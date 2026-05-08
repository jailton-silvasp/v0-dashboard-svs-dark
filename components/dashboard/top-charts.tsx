"use client"

import { Trophy, Clock } from "lucide-react"
import { useRankingDiario } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPoints } from "@/lib/api"

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
}

function HorizontalBarChart({ title, icon, data, color, subtitle, isLoading }: ChartProps) {
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
        <span>Jogador</span>
        <span className="text-right">Pontos</span>
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
            Nenhum dado disponível
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="grid grid-cols-[30px_1fr_70px] gap-2 items-center group">
              <span className="text-gray-500 text-sm">{index + 1}</span>
              <div className="flex items-center gap-2">
                <div 
                  className="h-4 rounded-r transition-all duration-300 group-hover:opacity-80"
                  style={{ 
                    width: `${(item.points / maxPoints) * 100}%`,
                    backgroundColor: color,
                    minWidth: '20px'
                  }}
                />
                <span className="text-gray-400 text-xs whitespace-nowrap truncate">{item.name}</span>
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

export function TopCharts() {
  const { ranking: rankingDiario, isLoading: isLoadingDiario } = useRankingDiario()

  // Top 10 Geral - Maiores Pontos (do dia vigente, ordenado por maior pontuação)
  const maioresPontosData: ChartData[] = [...rankingDiario]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(p => ({
      name: p.usuario,
      points: p.total
    }))

  // Top 10 Geral - Últimos Pontos (do dia vigente, ordenado pelos últimos registros)
  const ultimosPontosData: ChartData[] = rankingDiario.slice(0, 10).map(p => ({
    name: p.usuario,
    points: p.total
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <HorizontalBarChart
        title="Top 10 Geral - Maiores Pontos"
        icon={<Trophy className="w-5 h-5 text-[#c9a55c]" />}
        data={maioresPontosData}
        color="#c9a55c"
        subtitle="Maiores pontuações do dia"
        isLoading={isLoadingDiario}
      />
      <HorizontalBarChart
        title="Top 10 Geral - Últimos Pontos"
        icon={<Clock className="w-5 h-5 text-[#c9a55c]" />}
        data={ultimosPontosData}
        color="#c9a55c"
        subtitle="Últimos registros do dia"
        isLoading={isLoadingDiario}
      />
    </div>
  )
}
