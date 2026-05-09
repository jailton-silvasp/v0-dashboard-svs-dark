"use client"

import { Crown, User } from "lucide-react"

import { useVsSemanal } from "@/hooks/use-api"
import { formatPoints } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function MVPCard() {
  const { ranking, isLoading, isError } = useVsSemanal()

  const mvp = ranking.length > 0 ? ranking[0] : null

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-[#c9a55c]" />
          <h3 className="text-[#c9a55c] font-semibold uppercase tracking-wide text-sm">
            MVP da Semana
          </h3>
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="w-28 h-28 rounded-full bg-[#2a2a2a] mb-4" />
          <Skeleton className="w-32 h-6 bg-[#2a2a2a] mb-2" />
          <Skeleton className="w-16 h-4 bg-[#2a2a2a] mb-2" />
          <Skeleton className="w-24 h-10 bg-[#2a2a2a]" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-5 transition-all duration-300 hover:border-[#c9a55c]">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-[#c9a55c]" />
        <h3 className="text-[#c9a55c] font-semibold uppercase tracking-wide text-sm">
          MVP da Semana
        </h3>
      </div>

      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full border-4 border-[#c9a55c] bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
            {mvp?.avatar_url ? (
              <img
                src={mvp.avatar_url}
                alt={mvp.usuario}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-600" />
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#c9a55c] text-[#0d0d0d] w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
            1
          </div>
        </div>

        {/* Info */}
        {isError || !mvp ? (
          <div className="text-center">
            <p className="text-gray-500">Nenhum MVP ainda</p>
          </div>
        ) : (
          <>
            <h4 className="text-white font-bold text-lg text-center">{mvp.usuario}</h4>
            <p className="text-gray-400 text-sm mt-1">Pontos</p>
            <p className="text-[#c9a55c] text-4xl font-bold">
              {formatPoints(mvp.total)} <span className="text-lg">pts</span>
            </p>
            <p className="text-gray-500 text-xs mt-2">Parabens pelo desempenho!</p>
          </>
        )}
      </div>
    </div>
  )
}
