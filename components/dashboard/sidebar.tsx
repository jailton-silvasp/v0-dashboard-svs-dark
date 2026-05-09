"use client"

import { 
  Home, 
  Crown, 
  Swords 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Visão Geral", active: true },
]

export function Sidebar() {
  return (
    <aside className="w-[200px] bg-[#0d0d0d] border-r border-[#2a2a2a] flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex flex-col items-center border-b border-[#2a2a2a]">
        <div className="relative">
          <Crown className="w-12 h-12 text-[#c9a55c]" />
          <Swords className="w-6 h-6 text-[#c9a55c] absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
        <h1 className="text-2xl font-bold text-[#c9a55c] mt-1">SVS</h1>
        <span className="text-xs text-red-500 font-semibold tracking-wider">{"ΞLØ - S U P R Ξ M Ø"}</span>
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
