"use client"

import { Swords, Flag } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"
import { useVsSemanal, useF1Semanal } from "@/hooks/use-api"
import { formatPoints } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"

interface ChartData {
  name: string
  points: number
}

interface VerticalChartProps {
  title: string
  icon: React.ReactNode
  data: ChartData[]
  color: string
  subtitle: string
  isLoading?: boolean
  pointsLabel: string
}

function VerticalBarChart({ title, icon, data, color, subtitle, isLoading, pointsLabel }: VerticalChartProps) {
  const maxPoints = data.length > 0 ? Math.max(...data.map(d => d.points)) : 1
  const yAxisMax = Math.ceil(maxPoints * 1.2)
  
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: ChartData }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-[#c9a55c]">{formatPoints(payload[0].value)} {pointsLabel}</p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
            {title}
          </h3>
        </div>
        <div className="h-[250px] flex items-center justify-center">
          <div className="flex items-end gap-2 h-[200px]">
            {[...Array(10)].map((_, i) => (
              <Skeleton 
                key={i} 
                className="w-6 bg-[#2a2a2a]" 
                style={{ height: `${180 - i * 15}px` }} 
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
          {title}
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      ) : (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#888', fontSize: 9 }}
                axisLine={{ stroke: '#2a2a2a' }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                tick={{ fill: '#888', fontSize: 10 }}
                axisLine={{ stroke: '#2a2a2a' }}
                tickLine={false}
                domain={[0, yAxisMax]}
                tickFormatter={(value) => formatPoints(value)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201, 165, 92, 0.1)' }} />
              <Bar 
                dataKey="points" 
                fill={color} 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              >
                <LabelList 
                  dataKey="points" 
                  position="top" 
                  fill="#888" 
                  fontSize={10}
                  formatter={(value: number) => formatPoints(value)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[#2a2a2a]">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>
    </div>
  )
}

export function WeeklyCharts() {
  const { ranking: vsSemanal, isLoading: isLoadingVs } = useVsSemanal()
  const { ranking: f1Semanal, isLoading: isLoadingF1 } = useF1Semanal()
  const { t } = useLanguage()

  // VS: soma semanal de todas as marcacoes - ordenado em ordem decrescente
  const vsData: ChartData[] = [...vsSemanal]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(p => ({
      name: p.usuario,
      points: p.total
    }))

  // F1: ultima marcacao da semana - ordenado em ordem decrescente
  const f1Data: ChartData[] = [...f1Semanal]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map(p => ({
      name: p.usuario,
      points: p.total
    }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <VerticalBarChart
        title={t.vsWeekly}
        icon={<Swords className="w-5 h-5 text-[#c9a55c]" />}
        data={vsData}
        color="#c9a55c"
        subtitle={t.weeklyVsScore}
        isLoading={isLoadingVs}
        pointsLabel={t.pointsLower}
      />
      <VerticalBarChart
        title={t.f1Weekly}
        icon={<Flag className="w-5 h-5 text-[#3b82f6]" />}
        data={f1Data}
        color="#3b82f6"
        subtitle={t.lastF1MarkOfWeek}
        isLoading={isLoadingF1}
        pointsLabel={t.pointsLower}
      />
    </div>
  )
}
