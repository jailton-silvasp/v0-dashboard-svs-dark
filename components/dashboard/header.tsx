"use client"

import { Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(t.dateLocale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(t.dateLocale, {
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
          <Image
            src="/logo-elo-supremo.png"
            alt="ELO Supremo"
            width={72}
            height={72}
            className="object-contain sepia saturate-150 hue-rotate-[10deg] brightness-110"
            priority
          />
          <h1 className="text-3xl font-bold text-[#c9a55c] tracking-wide">VS</h1>
        </div>
        
        <div className="hidden sm:block h-10 w-px bg-[#2a2a2a] mx-2" />
        
        <div className="hidden sm:block">
          <h2 className="text-xl font-bold text-white tracking-wide">{t.dashboard}</h2>
          <p className="text-gray-500 text-xs">{t.headerSubtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Flags */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage("pt")}
            className={`w-8 h-6 rounded overflow-hidden border-2 transition-all duration-200 ${
              language === "pt" 
                ? "border-[#c9a55c] shadow-[0_0_8px_rgba(201,165,92,0.5)]" 
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            title="Portugues (Brasil)"
            aria-label="Mudar para Portugues"
          >
            <svg viewBox="0 0 32 22" className="w-full h-full">
              <rect fill="#009c3b" width="32" height="22"/>
              <polygon fill="#ffdf00" points="16,2 30,11 16,20 2,11"/>
              <circle fill="#002776" cx="16" cy="11" r="5"/>
              <path fill="#fff" d="M11.5,11 Q16,8 20.5,11" stroke="#fff" strokeWidth="0.5" fill="none"/>
            </svg>
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`w-8 h-6 rounded overflow-hidden border-2 transition-all duration-200 ${
              language === "en" 
                ? "border-[#c9a55c] shadow-[0_0_8px_rgba(201,165,92,0.5)]" 
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
            title="English (US)"
            aria-label="Change to English"
          >
            <svg viewBox="0 0 32 22" className="w-full h-full">
              <rect fill="#b22234" width="32" height="22"/>
              <rect fill="#fff" y="1.7" width="32" height="1.7"/>
              <rect fill="#fff" y="5.1" width="32" height="1.7"/>
              <rect fill="#fff" y="8.5" width="32" height="1.7"/>
              <rect fill="#fff" y="11.9" width="32" height="1.7"/>
              <rect fill="#fff" y="15.3" width="32" height="1.7"/>
              <rect fill="#fff" y="18.7" width="32" height="1.7"/>
              <rect fill="#3c3b6e" width="12.8" height="11.9"/>
              <g fill="#fff">
                <circle cx="2.1" cy="1.5" r="0.6"/>
                <circle cx="4.3" cy="1.5" r="0.6"/>
                <circle cx="6.4" cy="1.5" r="0.6"/>
                <circle cx="8.5" cy="1.5" r="0.6"/>
                <circle cx="10.7" cy="1.5" r="0.6"/>
                <circle cx="3.2" cy="3" r="0.6"/>
                <circle cx="5.3" cy="3" r="0.6"/>
                <circle cx="7.5" cy="3" r="0.6"/>
                <circle cx="9.6" cy="3" r="0.6"/>
                <circle cx="2.1" cy="4.5" r="0.6"/>
                <circle cx="4.3" cy="4.5" r="0.6"/>
                <circle cx="6.4" cy="4.5" r="0.6"/>
                <circle cx="8.5" cy="4.5" r="0.6"/>
                <circle cx="10.7" cy="4.5" r="0.6"/>
                <circle cx="3.2" cy="6" r="0.6"/>
                <circle cx="5.3" cy="6" r="0.6"/>
                <circle cx="7.5" cy="6" r="0.6"/>
                <circle cx="9.6" cy="6" r="0.6"/>
                <circle cx="2.1" cy="7.5" r="0.6"/>
                <circle cx="4.3" cy="7.5" r="0.6"/>
                <circle cx="6.4" cy="7.5" r="0.6"/>
                <circle cx="8.5" cy="7.5" r="0.6"/>
                <circle cx="10.7" cy="7.5" r="0.6"/>
                <circle cx="3.2" cy="9" r="0.6"/>
                <circle cx="5.3" cy="9" r="0.6"/>
                <circle cx="7.5" cy="9" r="0.6"/>
                <circle cx="9.6" cy="9" r="0.6"/>
                <circle cx="2.1" cy="10.5" r="0.6"/>
                <circle cx="4.3" cy="10.5" r="0.6"/>
                <circle cx="6.4" cy="10.5" r="0.6"/>
                <circle cx="8.5" cy="10.5" r="0.6"/>
                <circle cx="10.7" cy="10.5" r="0.6"/>
              </g>
            </svg>
          </button>
        </div>

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
