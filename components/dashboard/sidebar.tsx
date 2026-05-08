"use client"

import Image from "next/image"
import { 
  Home, 
  Trophy, 
  Swords, 
  BarChart3, 
  Flag, 
  Crown, 
  Clock, 
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Visão Geral", active: true },
  { icon: Trophy, label: "Ranking", active: false },
  { icon: Swords, label: "VS Diário", active: false },
  { icon: BarChart3, label: "VS Semanal", active: false },
  { icon: Flag, label: "F1 Semanal", active: false },
  { icon: Crown, label: "MVP da Semana", active: false },
  { icon: Clock, label: "Histórico", active: false },
  { icon: Users, label: "Jogadores", active: false },
]

export function Sidebar() {
  return (
    <aside className="w-[200px] bg-[#0d0d0d] border-r border-[#2a2a2a] flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex flex-col items-center border-b border-[#2a2a2a]">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#c9a55c] shadow-lg shadow-[#c9a55c]/20">
          <Image
            src="/logo-elo.png"
            alt="ELO Supremo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <span className="text-xs text-red-500 font-semibold tracking-wider mt-2">DARK WAR</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200",
              "hover:bg-[#1a1a1a] hover:text-[#c9a55c]",
              item.active 
                ? "bg-[#c9a55c] text-[#0d0d0d] font-medium" 
                : "text-gray-400"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2a2a2a] text-center">
        <p className="text-xs text-gray-500">© 2025 SVS - ΞLØ</p>
        <p className="text-xs text-gray-600">Todos os direitos reservados.</p>
      </div>
    </aside>
  )
}
