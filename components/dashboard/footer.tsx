"use client"

import { Swords, Info, Terminal, Clock, Crown } from "lucide-react"
import { useRecentRecords } from "@/hooks/use-api"
import { formatPoints, formatBrazilTime } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

const commands = [
  { cmd: "!vs", desc: "Registra sua pontuação no VS" },
  { cmd: "!f1", desc: "Registra sua pontuação no F1" },
  { cmd: "!ranking", desc: "Mostra o ranking dos jogadores" },
]

export function Footer() {
  const { records, isLoading } = useRecentRecords()

  return (
    <div className="mt-6">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* About */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 transition-all duration-300 hover:border-[#c9a55c]">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-[#c9a55c]" />
            <h4 className="text-white font-semibold uppercase tracking-wide text-xs">Sobre</h4>
          </div>
          <div className="flex items-start gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#c9a55c] bg-[#0d0d0d] shrink-0">
              <Image
                src="/logo-elo-supremo.png"
                alt="ELO Supremo"
                fill
                className="object-cover scale-[1.35]"
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {"Dashboard oficial ΞLØ - S U P R Ξ M Ø. Acompanhe rankings, estatísticas e desempenho dos melhores jogadores!"}
            </p>
          </div>
        </div>

        {/* Commands */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 transition-all duration-300 hover:border-[#c9a55c]">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-[#c9a55c]" />
            <h4 className="text-white font-semibold uppercase tracking-wide text-xs">Comandos Principais</h4>
          </div>
          <div className="space-y-2">
            {commands.map((cmd, i) => (
              <div key={i} className="text-xs">
                <span className="text-[#c9a55c] font-mono">{cmd.cmd}</span>
                <p className="text-gray-500">{cmd.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 transition-all duration-300 hover:border-[#c9a55c]">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#c9a55c]" />
            <h4 className="text-[#c9a55c] font-semibold uppercase tracking-wide text-xs">Últimos Registros</h4>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="w-3 h-3 bg-[#2a2a2a] mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-full bg-[#2a2a2a]" />
                    <Skeleton className="h-2 w-16 bg-[#2a2a2a]" />
                  </div>
                </div>
              ))
            ) : records.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-2">Nenhum registro hoje</p>
            ) : (
              records.slice(0, 3).map((record, i) => (
                <div key={i} className="flex items-start gap-2 text-xs group cursor-pointer">
                  <Swords className="w-3 h-3 text-[#c9a55c] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-400 group-hover:text-white transition-colors">
                      {record.usuario} registrou {formatPoints(record.valor)} pontos
                    </p>
                    <p className="text-gray-600">{formatBrazilTime(record.criado_em)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-3 py-1.5 border border-[#2a2a2a] rounded text-gray-500 text-xs hover:border-[#c9a55c] hover:text-[#c9a55c] transition-all duration-200">
            VER TODOS
          </button>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="border-t border-[#2a2a2a] pt-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-gray-600 text-xs">developed by</span>
          <div className="flex items-center gap-1">
            <Crown className="w-4 h-4 text-[#c9a55c]" />
            <span className="text-[#c9a55c] font-bold text-sm tracking-wider">{"『PRΞDΔDΩR』"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
