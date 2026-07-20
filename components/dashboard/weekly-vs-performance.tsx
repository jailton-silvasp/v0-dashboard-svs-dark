"use client"

import { TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts"
import { useVsEvolucaoSemanal, getWeekDates } from "@/hooks/use-api"
import { formatPoints } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"

interface DayData {
  name: string
  points: number
  isToday: boolean
}

const COLOR = "#c9a55c"
const COLOR_TODAY = "#e8c87a"

export function WeeklyVsPerformance() {
  const { data, isLoading } = useVsEvolucaoSemanal()
  const { t } = useLanguage()

  // Data ISO de hoje no fuso de Brasília para destacar a barra do dia
  const todayIso = getWeekDates().find((d) => {
    const spNow = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
    const iso = `${spNow.getFullYear()}-${String(spNow.getMonth() + 1).padStart(2, "0")}-${String(spNow.getDate()).padStart(2, "0")}`
    return d === iso
  })

  const chartData: DayData[] = data.map((d, i) => ({
    name: t.weekdaysShort[i] ?? d.date,
    points: d.total,
    isToday: d.date === todayIso,
  }))

  const weekTotal = data.reduce((sum, d) => sum + d.total, 0)
  const maxPoints = chartData.length > 0 ? Math.max(...chartData.map((d) => d.points), 1) : 1
  const yAxisMax = Math.ceil(maxPoints * 1.2)

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ value: number; payload: DayData }>
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-[#c9a55c]">
            {formatPoints(payload[0].value)} {t.pointsLower}
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#c9a55c]" />
          <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
            {t.weeklyVsPerformance}
          </h3>
        </div>
        <div className="h-[250px] flex items-end justify-center gap-3">
          {[...Array(7)].map((_, i) => (
            <Skeleton
              key={i}
              className="w-10 bg-[#2a2a2a]"
              style={{ height: `${80 + ((i * 37) % 140)}px` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#c9a55c]" />
          <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
            {t.weeklyVsPerformance}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">{t.weekTotal}</p>
          <p className="text-[#c9a55c] font-bold text-lg leading-none">{formatPoints(weekTotal)}</p>
        </div>
      </div>

      {weekTotal === 0 ? (
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">{t.weeklyVsPerformanceSubtitle}</p>
        </div>
      ) : (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 24, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#888", fontSize: 11 }}
                axisLine={{ stroke: "#2a2a2a" }}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#888", fontSize: 10 }}
                axisLine={{ stroke: "#2a2a2a" }}
                tickLine={false}
                domain={[0, yAxisMax]}
                tickFormatter={(value) => formatPoints(value)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(201, 165, 92, 0.1)" }} />
              <Bar dataKey="points" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.isToday ? COLOR_TODAY : COLOR} />
                ))}
                <LabelList
                  dataKey="points"
                  position="top"
                  fill="#888"
                  fontSize={10}
                  formatter={(value: number) => (value > 0 ? formatPoints(value) : "")}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[#2a2a2a]">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: COLOR }} />
        <span className="text-xs text-gray-500">{t.weeklyVsPerformanceSubtitle}</span>
      </div>
    </div>
  )
}
