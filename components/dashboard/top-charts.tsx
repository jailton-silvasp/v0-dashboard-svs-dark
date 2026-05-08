"use client"

import { Trophy, Clock, User } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"

const maioresPontosData = [
  { name: "Jailton Silva", points: 965 },
  { name: "Gabriel Santos", points: 920 },
  { name: "Lucas Ferreira", points: 875 },
  { name: "Matheus Souza", points: 730 },
  { name: "Ryan Oliveira", points: 688 },
  { name: "Vinicius Lima", points: 645 },
  { name: "Felipe Rodrigues", points: 590 },
  { name: "Anderson Pereira", points: 560 },
  { name: "Leonardo Martins", points: 515 },
  { name: "Bruno Alves", points: 498 },
]

const ultimosPontosData = [
  { name: "Felipe Rodrigues", points: 210 },
  { name: "Bruno Alves", points: 198 },
  { name: "Anderson Pereira", points: 185 },
  { name: "Leonardo Martins", points: 172 },
  { name: "Vinicius Lima", points: 160 },
  { name: "Matheus Souza", points: 145 },
  { name: "Ryan Oliveira", points: 133 },
  { name: "Lucas Ferreira", points: 120 },
  { name: "Gabriel Santos", points: 110 },
  { name: "Jailton Silva", points: 98 },
]

interface ChartProps {
  title: string
  icon: React.ReactNode
  data: typeof maioresPontosData
  color: string
  subtitle: string
}

function HorizontalBarChart({ title, icon, data, color, subtitle }: ChartProps) {
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
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-[30px_1fr_70px] gap-2 items-center group">
            <span className="text-gray-500 text-sm">{index + 1}</span>
            <div className="flex items-center gap-2">
              <div 
                className="h-4 rounded-r transition-all duration-300 group-hover:opacity-80"
                style={{ 
                  width: `${(item.points / data[0].points) * 100}%`,
                  backgroundColor: color,
                  minWidth: '20px'
                }}
              />
              <span className="text-gray-400 text-xs whitespace-nowrap">{item.name}</span>
            </div>
            <span className="text-white text-sm text-right font-medium">{item.points}</span>
          </div>
        ))}
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <HorizontalBarChart
        title="Top 10 Geral - Maiores Pontos"
        icon={<Trophy className="w-5 h-5 text-[#c9a55c]" />}
        data={maioresPontosData}
        color="#c9a55c"
        subtitle="Pontuação geral - Top 10"
      />
      <HorizontalBarChart
        title="Top 10 Geral - Últimos Pontos"
        icon={<Clock className="w-5 h-5 text-[#c9a55c]" />}
        data={ultimosPontosData}
        color="#c9a55c"
        subtitle="Últimos pontos acumulados"
      />
    </div>
  )
}
