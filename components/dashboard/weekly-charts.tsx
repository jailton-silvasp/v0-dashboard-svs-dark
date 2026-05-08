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

const vsSemanalData = [
  { name: "Jailton Silva", shortName: "Jailton\nSilva", points: 520 },
  { name: "Gabriel Santos", shortName: "Gabriel\nSantos", points: 490 },
  { name: "Lucas Ferreira", shortName: "Lucas\nFerreira", points: 455 },
  { name: "Matheus Souza", shortName: "Matheus\nSouza", points: 395 },
  { name: "Ryan Oliveira", shortName: "Ryan\nOliveira", points: 355 },
  { name: "Vinicius Lima", shortName: "Vinicius\nLima", points: 305 },
  { name: "Felipe Rodrigues", shortName: "Felipe\nRodrigues", points: 280 },
  { name: "Anderson Pereira", shortName: "Anderson\nPereira", points: 250 },
  { name: "Leonardo Martins", shortName: "Leonardo\nMartins", points: 220 },
  { name: "Bruno Alves", shortName: "Bruno\nAlves", points: 195 },
]

const f1SemanalData = [
  { name: "Jailton Silva", shortName: "Jailton\nSilva", points: 470 },
  { name: "Gabriel Santos", shortName: "Gabriel\nSantos", points: 430 },
  { name: "Lucas Ferreira", shortName: "Lucas\nFerreira", points: 390 },
  { name: "Matheus Souza", shortName: "Matheus\nSouza", points: 345 },
  { name: "Ryan Oliveira", shortName: "Ryan\nOliveira", points: 300 },
  { name: "Vinicius Lima", shortName: "Vinicius\nLima", points: 260 },
  { name: "Felipe Rodrigues", shortName: "Felipe\nRodrigues", points: 230 },
  { name: "Anderson Pereira", shortName: "Anderson\nPereira", points: 200 },
  { name: "Leonardo Martins", shortName: "Leonardo\nMartins", points: 175 },
  { name: "Bruno Alves", shortName: "Bruno\nAlves", points: 150 },
]

interface VerticalChartProps {
  title: string
  icon: React.ReactNode
  data: typeof vsSemanalData
  color: string
  subtitle: string
}

function VerticalBarChart({ title, icon, data, color, subtitle }: VerticalChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-[#c9a55c]">{payload[0].value} pontos</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
          {title}
        </h3>
      </div>

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
              domain={[0, 600]}
              ticks={[0, 100, 200, 300, 400, 500, 600]}
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
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[#2a2a2a]">
        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
        <span className="text-xs text-gray-500">{subtitle}</span>
      </div>
    </div>
  )
}

export function WeeklyCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <VerticalBarChart
        title="VS Semanal"
        icon={<Swords className="w-5 h-5 text-[#c9a55c]" />}
        data={vsSemanalData}
        color="#c9a55c"
        subtitle="Pontuação semanal de VS"
      />
      <VerticalBarChart
        title="F1 Semanal"
        icon={<Flag className="w-5 h-5 text-[#3b82f6]" />}
        data={f1SemanalData}
        color="#3b82f6"
        subtitle="Pontuação semanal de F1"
      />
    </div>
  )
}
