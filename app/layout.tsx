import type { Metadata } from 'next'
import { Rajdhani, Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
import './globals.css'

const rajdhani = Rajdhani({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani'
});

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto'
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
      <body className={`${rajdhani.variable} ${roboto.variable} font-sans antialiased bg-[#0d0d0d] text-white`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
