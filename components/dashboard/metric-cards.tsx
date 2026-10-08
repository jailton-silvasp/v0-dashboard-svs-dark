"use client"

import { Swords, Trophy, Flag, Users } from "lucide-react"
import { useDashboard, useRanking } from "@/hooks/use-api"
import { formatPoints, toFiniteNumber } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"

export function MetricCards() {
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboard()
  const { ranking, isLoading: isLoadingRanking } = useRanking()
  const { t } = useLanguage()

  const isLoading = isLoadingDashboard || isLoadingRanking
  const vsTotal = dashboardData?.vs ?? []
  const totalVs = vsTotal.reduce((sum, player) => sum + toFiniteNumber(player.total), 0)
  const topScore = vsTotal[0]?.total ?? 0

  const metrics = [
    {
      icon: Swords,
      label: t.vsToday,
      value: ranking.reduce((sum, player) => sum + toFiniteNumber(player.total), 0),
      subtitle: t.recordsRegistered,
      iconColor: "text-[#c9a55c]",
    },
    {
      icon: Trophy,
      label: t.vsTotal,
      value: totalVs,
      subtitle: t.totalRecords,
      iconColor: "text-[#c9a55c]",
    },
    {
      icon: Flag,
      label: t.topScore,
      value: topScore,
      subtitle: t.highestScore,
      iconColor: "text-[#3b82f6]",
    },
    {
      icon: Users,
      label: t.players,
      value: vsTotal.length,
      subtitle: t.inRanking,
      iconColor: "text-[#3b82f6]",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-5 h-5 rounded bg-[#2a2a2a]" />
              <Skeleton className="w-16 h-3 bg-[#2a2a2a]" />
            </div>
            <Skeleton className="w-20 h-8 bg-[#2a2a2a] mb-1" />
            <Skeleton className="w-24 h-3 bg-[#2a2a2a]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 transition-all duration-300 hover:border-[#c9a55c] hover:shadow-lg hover:shadow-[#c9a55c]/10 group"
        >
          <div className="flex items-center gap-2 mb-2">
            <metric.icon
              className={`w-5 h-5 ${metric.iconColor} ${
                metric.iconColor.includes("c9a55c")
                  ? "drop-shadow-[0_0_8px_rgba(201,165,92,0.8)] filter"
                  : "drop-shadow-[0_0_6px_rgba(59,130,246,0.6)] filter"
              }`}
            />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {metric.label}
            </span>
          </div>
          <p className="text-3xl font-bold text-white group-hover:text-[#c9a55c] transition-colors">
            {formatPoints(metric.value)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {metric.subtitle}
          </p>
        </div>
      ))}
    </div>
  )
}
