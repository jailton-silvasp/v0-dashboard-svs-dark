"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Language = "pt" | "en"

interface Translations {
  // Header
  dashboard: string
  headerSubtitle: string
  
  // Metric Cards
  vsToday: string
  vsTotal: string
  topScore: string
  players: string
  recordsRegistered: string
  totalRecords: string
  highestScore: string
  inRanking: string
  
  // MVP Card
  mvpOfWeek: string
  points: string
  pts: string
  congratsPerformance: string
  noMvpYet: string
  
  // VS Diario Filter
  vsDaily: string
  selectDate: string
  filter: string
  resultsOf: string
  noRecordsForDate: string
  
  // Top Ranking
  top10Weekly: string
  reset: string
  days: string
  viewFullRanking: string
  errorLoadingRanking: string
  noPlayersInRanking: string
  weeklyRankingFull: string
  totalPlayersInRanking: string
  
  // Top Charts
  top10HighestPoints: string
  top10LatestPoints: string
  highestScoresOf: string
  latestRecordsOf: string
  today: string
  player: string
  noDataAvailable: string
  
  // Weekly Charts
  vsWeekly: string
  f1Weekly: string
  weeklyVsScore: string
  lastF1MarkOfWeek: string
  
  // Footer
  about: string
  aboutText: string
  mainCommands: string
  cmdVsDesc: string
  cmdF1Desc: string
  cmdRankingDesc: string
  latestRecords: string
  f1LatestMark: string
  noRecordsToday: string
  registered: string
  pointsLower: string
  viewAll: string
  recordsOfToday: string
  totalRecordsToday: string
  developedBy: string
  
  // Date formatting
  dateLocale: string
}

const translations: Record<Language, Translations> = {
  pt: {
    // Header
    dashboard: "DASHBOARD",
    headerSubtitle: "Acompanhe o desempenho dos jogadores em tempo real.",
    
    // Metric Cards
    vsToday: "VS HOJE",
    vsTotal: "VS TOTAL",
    topScore: "TOP SCORE",
    players: "JOGADORES",
    recordsRegistered: "Confrontos registrados",
    totalRecords: "Total de registros",
    highestScore: "Maior pontuação",
    inRanking: "No ranking",
    
    // MVP Card
    mvpOfWeek: "MVP da Semana",
    points: "Pontos",
    pts: "pts",
    congratsPerformance: "Parabéns pelo desempenho!",
    noMvpYet: "Nenhum MVP ainda",
    
    // VS Diario Filter
    vsDaily: "VS Diário",
    selectDate: "Selecione a data:",
    filter: "FILTRAR",
    resultsOf: "Resultados de",
    noRecordsForDate: "Nenhum registro encontrado para esta data",
    
    // Top Ranking
    top10Weekly: "TOP 10 SEMANAL",
    reset: "Reset:",
    days: "d",
    viewFullRanking: "VER RANKING COMPLETO",
    errorLoadingRanking: "Erro ao carregar ranking",
    noPlayersInRanking: "Nenhum jogador no ranking",
    weeklyRankingFull: "RANKING SEMANAL COMPLETO",
    totalPlayersInRanking: "Total de {count} jogadores no ranking",
    
    // Top Charts
    top10HighestPoints: "Top 10 Geral - Maiores Pontos",
    top10LatestPoints: "Top 10 Geral - Menores Pontos",
    highestScoresOf: "Maiores pontuações de",
    latestRecordsOf: "Menores pontuações de",
    today: "hoje",
    player: "Jogador",
    noDataAvailable: "Nenhum dado disponível",
    
    // Weekly Charts
    vsWeekly: "VS Semanal",
    f1Weekly: "F1 — Top 10",
    weeklyVsScore: "Pontuação semanal de VS",
    lastF1MarkOfWeek: "Últimas marcações de F1 (Top 10)",
    
    // Footer
    about: "Sobre",
    aboutText: "Dashboard oficial ELO - S U P R E M O. Acompanhe rankings, estatísticas e desempenho dos melhores jogadores!",
    mainCommands: "Comandos Principais",
    cmdVsDesc: "Registra sua pontuação no VS",
    cmdF1Desc: "Registra sua pontuação no F1",
    cmdRankingDesc: "Mostra o ranking dos jogadores",
    latestRecords: "Últimos Registros",
    f1LatestMark: "marcou no F1",
    noRecordsToday: "Nenhum registro hoje",
    registered: "registrou",
    pointsLower: "pontos",
    viewAll: "VER TODOS",
    recordsOfToday: "REGISTROS DE HOJE",
    totalRecordsToday: "Total de {count} registros hoje",
    developedBy: "developed by",
    
    // Date formatting
    dateLocale: "pt-BR",
  },
  en: {
    // Header
    dashboard: "DASHBOARD",
    headerSubtitle: "Track player performance in real time.",
    
    // Metric Cards
    vsToday: "VS TODAY",
    vsTotal: "VS TOTAL",
    topScore: "TOP SCORE",
    players: "PLAYERS",
    recordsRegistered: "Registered battles",
    totalRecords: "Total records",
    highestScore: "Highest score",
    inRanking: "In ranking",
    
    // MVP Card
    mvpOfWeek: "MVP of the Week",
    points: "Points",
    pts: "pts",
    congratsPerformance: "Congratulations on the performance!",
    noMvpYet: "No MVP yet",
    
    // VS Diario Filter
    vsDaily: "Daily VS",
    selectDate: "Select date:",
    filter: "FILTER",
    resultsOf: "Results of",
    noRecordsForDate: "No records found for this date",
    
    // Top Ranking
    top10Weekly: "TOP 10 WEEKLY",
    reset: "Reset:",
    days: "d",
    viewFullRanking: "VIEW FULL RANKING",
    errorLoadingRanking: "Error loading ranking",
    noPlayersInRanking: "No players in ranking",
    weeklyRankingFull: "FULL WEEKLY RANKING",
    totalPlayersInRanking: "Total of {count} players in ranking",
    
    // Top Charts
    top10HighestPoints: "Top 10 Overall - Highest Points",
    top10LatestPoints: "Top 10 Overall - Latest Points",
    highestScoresOf: "Highest scores of",
    latestRecordsOf: "Latest records of",
    today: "today",
    player: "Player",
    noDataAvailable: "No data available",
    
    // Weekly Charts
    vsWeekly: "Weekly VS",
    f1Weekly: "F1 — Top 10",
    weeklyVsScore: "Weekly VS score",
    lastF1MarkOfWeek: "Latest F1 marks (Top 10)",
    
    // Footer
    about: "About",
    aboutText: "Official ELO - S U P R E M E dashboard. Track rankings, statistics and performance of the best players!",
    mainCommands: "Main Commands",
    cmdVsDesc: "Register your VS score",
    cmdF1Desc: "Register your F1 score",
    cmdRankingDesc: "Shows player ranking",
    latestRecords: "Latest Records",
    f1LatestMark: "marked in F1",
    noRecordsToday: "No records today",
    registered: "registered",
    pointsLower: "points",
    viewAll: "VIEW ALL",
    recordsOfToday: "TODAY'S RECORDS",
    totalRecordsToday: "Total of {count} records today",
    developedBy: "developed by",
    
    // Date formatting
    dateLocale: "en-US",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null
    if (saved && (saved === "pt" || saved === "en")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
