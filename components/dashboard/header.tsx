"use client"

import { Calendar, Users, Crown, Swords, Menu } from "lucide-react"
import { useState, useEffect } from "react"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    // Inicializa apenas no cliente para evitar erro de hidratação
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).replace(' de ', ' de ')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <header className="flex items-center justify-between pb-6 border-b border-[#2a2a2a] mb-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-[#c9a55c] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">DASHBOARD</h1>
          <p className="text-gray-500 text-sm">Acompanhe o desempenho dos jogadores em tempo real.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date/Time */}
        <div className="hidden sm:flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div className="text-right">
            <p className="text-white text-sm">{currentTime ? formatDate(currentTime) : "--"}</p>
            <p className="text-[#c9a55c] text-xs font-mono">{currentTime ? formatTime(currentTime) : "--:--:--"}</p>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2">
          <Users className="w-5 h-5 text-[#3b82f6]" />
          <span className="text-white font-bold">SVS</span>
        </div>
      </div>
    </header>
  )
}
