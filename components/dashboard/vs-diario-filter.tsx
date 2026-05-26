"use client"

import { Swords, Loader2 } from "lucide-react"
import { useState, useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"

// Calcula a data do "dia atual" considerando que apos 23h conta como dia seguinte
// (meia noite no servidor = 23h Brasil)
function getServerDate(): string {
  const now = new Date()
  // Ajusta para timezone Brasil (UTC-3)
  const brasilOffset = -3 * 60
  const localOffset = now.getTimezoneOffset()
  const brasilNow = new Date(now.getTime() + (localOffset + brasilOffset) * 60000)
  
  const hour = brasilNow.getHours()
  
  // Se for apos 23h, considera como proximo dia
  if (hour >= 23) {
    const nextDay = new Date(brasilNow)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay.toISOString().split('T')[0]
  }
  
  return brasilNow.toISOString().split('T')[0]
}

interface VsDiarioFilterProps {
  onDateChange?: (date: string | null) => void
}

export function VsDiarioFilter({ onDateChange }: VsDiarioFilterProps) {
  const today = useMemo(() => getServerDate(), [])
  const [date, setDate] = useState(today)
  const [isFiltering, setIsFiltering] = useState(false)
  const { t } = useLanguage()

  const handleFilter = () => {
    setIsFiltering(true)
    onDateChange?.(date)
    // Simula um pequeno delay para feedback visual
    setTimeout(() => setIsFiltering(false), 300)
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center gap-2 mb-4">
        <Swords className="w-5 h-5 text-[#c9a55c]" />
        <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
          {t.vsDaily}
        </h3>
      </div>

      <div className="space-y-3">
        <label className="text-gray-400 text-xs">{t.selectDate}</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm focus:border-[#c9a55c] focus:outline-none transition-colors [color-scheme:dark]"
            />
          </div>
          <button 
            onClick={handleFilter}
            disabled={isFiltering}
            className="bg-[#c9a55c] text-[#0d0d0d] px-6 py-2 rounded-md font-semibold text-sm hover:bg-[#d4b56d] transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isFiltering ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t.filter
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
