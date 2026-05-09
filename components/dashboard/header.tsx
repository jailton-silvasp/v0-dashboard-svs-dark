"use client"

import { Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

export function Header() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
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
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-[#c9a55c] bg-[#0d0d0d]">
            <Image
              src="/logo-elo-supremo.png"
              alt="ELO Supremo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-[#c9a55c] tracking-wide">VS</h1>
        </div>
        
        <div className="hidden sm:block h-10 w-px bg-[#2a2a2a] mx-2" />
        
        <div className="hidden sm:block">
          <h2 className="text-xl font-bold text-white tracking-wide">DASHBOARD</h2>
          <p className="text-gray-500 text-xs">Acompanhe o desempenho dos jogadores em tempo real.</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date/Time */}
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div className="text-right">
            <p className="text-white text-sm hidden sm:block">{currentTime ? formatDate(currentTime) : "--"}</p>
            <p className="text-[#c9a55c] text-xs font-mono">{currentTime ? formatTime(currentTime) : "--:--:--"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
