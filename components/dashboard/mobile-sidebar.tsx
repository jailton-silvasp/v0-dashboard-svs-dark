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
  Users,
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
          <div className="relative w-28 h-28 drop-shadow-[0_0_15px_rgba(201,165,92,0.4)]">
            <Image
              src="/logo.png"
              alt="ELO SUPREMO"
              fill
              className="object-contain brightness-110 contrast-110 saturate-125"
              priority
            />
          </div>
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
          <p className="text-xs text-gray-500">© 2025 SVS - ΞLØ</p>
          <p className="text-xs text-gray-600">Todos os direitos reservados.</p>
        </div>
      </aside>
    </>
  )
}
