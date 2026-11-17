"use client"

import { useState } from "react"
import { User } from "lucide-react"

interface PlayerAvatarProps {
  src?: string | null
  name: string
  size?: number
  className?: string
}

export function PlayerAvatar({ src, name, size = 32, className = "" }: PlayerAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const normalizedSrc = typeof src === "string" ? src.trim() : ""
  const hasAvatar = normalizedSrc.length > 0 && failedSrc !== normalizedSrc

  return (
    <div
      className={`rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {hasAvatar ? (
        <img
          src={normalizedSrc}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(normalizedSrc)}
          className="w-full h-full object-cover"
        />
      ) : (
        <User className="w-4 h-4 text-gray-500" aria-label={`Avatar indisponível para ${name}`} />
      )}
    </div>
  )
}
