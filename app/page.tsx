"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { MVPCard } from "@/components/dashboard/mvp-card"
import { VsDiarioFilter } from "@/components/dashboard/vs-diario-filter"
import { TopRanking } from "@/components/dashboard/top-ranking"
import { TopCharts } from "@/components/dashboard/top-charts"
import { WeeklyCharts } from "@/components/dashboard/weekly-charts"
import { Footer } from "@/components/dashboard/footer"

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <Header />

          {/* Metric Cards */}
          <MetricCards />

          {/* Middle Section: MVP + VS Diário + Top Ranking */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            {/* Left Column: MVP + VS Diário */}
            <div className="space-y-4">
              <MVPCard />
              <VsDiarioFilter onDateChange={setSelectedDate} />
            </div>

            {/* Right Column: Top Ranking */}
            <div className="lg:col-span-2">
              <TopRanking />
            </div>
          </div>

          {/* Top 10 Charts */}
          <div className="mt-6">
            <TopCharts selectedDate={selectedDate} />
          </div>

          {/* Weekly Charts */}
          <div className="mt-6">
            <WeeklyCharts selectedDate={selectedDate} />
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </div>
  )
}
