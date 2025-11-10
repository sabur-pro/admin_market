import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/shared/ui/toaster'
import { TokenMigration } from '@/widgets/token-migration'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Админ-панель Market',
  description: 'Панель администратора для управления магазином',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <TokenMigration />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
