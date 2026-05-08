import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'SVS Dark War - Dashboard',
  description: 'Dashboard oficial do SVS - Dark War. Acompanhe rankings, estatísticas e desempenho dos melhores jogadores!',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-[#0d0d0d]">
      <body className={`${inter.variable} font-sans antialiased bg-[#0d0d0d] text-white`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
