"use client"

import { Swords, Trophy, Flag, Users } from "lucide-react"

const metrics = [
  {
    icon: Swords,
    label: "VS HOJE",
    value: "142",
    subtitle: "Confrontos registrados",
    iconColor: "text-[#c9a55c]",
  },
  {
    icon: Trophy,
    label: "VS SEMANA",
    value: "1.842",
    subtitle: "Pontos acumulados",
    iconColor: "text-[#c9a55c]",
  },
  {
    icon: Flag,
    label: "F1 SEMANAL",
    value: "1.256",
    subtitle: "Pontos acumulados",
    iconColor: "text-[#3b82f6]",
  },
  {
    icon: Users,
    label: "JOGADORES",
    value: "327",
    subtitle: "Ativos na comunidade",
    iconColor: "text-[#3b82f6]",
  },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 transition-all duration-300 hover:border-[#c9a55c] hover:shadow-lg hover:shadow-[#c9a55c]/10 group"
        >
          <div className="flex items-center gap-2 mb-2">
            <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {metric.label}
            </span>
          </div>
          <p className="text-3xl font-bold text-white group-hover:text-[#c9a55c] transition-colors">
            {metric.value}
          </p>
          <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
