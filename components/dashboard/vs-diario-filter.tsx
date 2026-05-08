"use client"

import { Swords, Calendar } from "lucide-react"
import { useState } from "react"

export function VsDiarioFilter() {
  const [date, setDate] = useState("2025-05-07")

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center gap-2 mb-4">
        <Swords className="w-5 h-5 text-[#c9a55c]" />
        <h3 className="text-white font-semibold uppercase tracking-wide text-sm">
          VS Diário
        </h3>
      </div>

      <div className="space-y-3">
        <label className="text-gray-400 text-xs">Selecione a data:</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-md px-3 py-2 text-white text-sm focus:border-[#c9a55c] focus:outline-none transition-colors [color-scheme:dark]"
            />
          </div>
          <button className="bg-[#c9a55c] text-[#0d0d0d] px-6 py-2 rounded-md font-semibold text-sm hover:bg-[#d4b56d] transition-all duration-200 flex items-center gap-2">
            FILTRAR
          </button>
        </div>
      </div>
    </div>
  )
}
