"use client"

import { 
  Home, 
  Trophy, 
  Swords, 
  BarChart3, 
  Flag, 
  Crown, 
  Clock, 
  Users, 
  Settings,
  X 
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
  { icon: Settings, label: "Configurações", active: false },
]

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#0d0d0d] border-r border-[#2a2a2a] z-50 lg:hidden overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#c9a55c] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-6 flex flex-col items-center border-b border-[#2a2a2a]">
          <div className="relative">
            <Crown className="w-14 h-14 text-[#c9a55c]" />
            <Swords className="w-7 h-7 text-[#c9a55c] absolute -bottom-1 left-1/2 -translate-x-1/2" />
          </div>
          <h1 className="text-3xl font-bold text-[#c9a55c] mt-2">SVS</h1>
          <span className="text-sm text-red-500 font-semibold tracking-wider">DARK WAR</span>
        </div>

        {/* Navigation */}
        <nav className="py-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={onClose}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 text-sm transition-all duration-200",
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
        <div className="p-6 border-t border-[#2a2a2a] text-center mt-auto">
          <p className="text-xs text-gray-500">© 2025 SVS - Dark War</p>
          <p className="text-xs text-gray-600">Todos os direitos reservados.</p>
        </div>
      </aside>
    </>
  )
}
