"use client"

import { Swords, Info, Terminal, Clock, Crown, X, User } from "lucide-react"
import { useRecentRecords } from "@/hooks/use-api"
import { formatPoints, formatBrazilTime } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useState } from "react"

const commands = [
  { cmd: "!vs", desc: "Registra sua pontuação no VS" },
  { cmd: "!f1", desc: "Registra sua pontuação no F1" },
  { cmd: "!ranking", desc: "Mostra o ranking dos jogadores" },
]

interface RecordsModalProps {
  isOpen: boolean
  onClose: () => void
  records: Array<{
    usuario: string
    valor: number
    criado_em: string
    avatar_url?: string
  }>
}

function RecordsModal({ isOpen, onClose, records }: RecordsModalProps) {
  console.log("[v0] RecordsModal - isOpen:", isOpen, "records:", records, "records.length:", records?.length)
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 sm:inset-10 md:inset-20 lg:inset-y-10 lg:inset-x-40 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#c9a55c]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">REGISTROS DE HOJE</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#c9a55c] transition-colors rounded-lg hover:bg-[#2a2a2a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_100px_80px] sm:grid-cols-[1fr_120px_100px] gap-2 px-4 sm:px-6 py-3 text-xs text-gray-500 uppercase tracking-wide border-b border-[#2a2a2a] bg-[#0d0d0d]">
          <span>Jogador</span>
          <span className="text-right">Pontos</span>
          <span className="text-right">Horario</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-[#2a2a2a]">
            {records.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum registro hoje
              </div>
            ) : (
              records.map((record, index) => (
                <div
                  key={`${record.usuario}-${record.criado_em}-${index}`}
                  className="grid grid-cols-[1fr_100px_80px] sm:grid-cols-[1fr_120px_100px] gap-2 items-center px-4 sm:px-6 py-3 hover:bg-[#2a2a2a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {record.avatar_url ? (
                        <img
                          src={record.avatar_url}
                          alt={record.usuario}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <span className="text-white text-sm truncate">
                      {record.usuario}
                    </span>
                  </div>

                  <span className="font-bold text-sm text-right text-[#c9a55c]">
                    {formatPoints(record.valor)}
                  </span>

                  <span className="text-gray-400 text-sm text-right">
                    {formatBrazilTime(record.criado_em)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#2a2a2a] bg-[#0d0d0d]">
          <p className="text-center text-gray-500 text-sm">
            Total de {records.length} registros hoje
          </p>
        </div>
      </div>
    </>
  )
}

export function Footer() {
  const { records, isLoading } = useRecentRecords()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  console.log("[v0] Footer - records:", records, "isLoading:", isLoading, "records.length:", records?.length)

  return (
    <>
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
            <Image
              src="/logo-elo-supremo.png"
              alt="ELO Supremo"
              width={48}
              height={48}
              className="object-contain sepia saturate-150 hue-rotate-[10deg] brightness-110 shrink-0"
            />
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
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={records.length === 0}
            className="w-full mt-3 py-1.5 border border-[#2a2a2a] rounded text-gray-500 text-xs hover:border-[#c9a55c] hover:text-[#c9a55c] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
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

    <RecordsModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      records={records}
    />
    </>
  )
}
