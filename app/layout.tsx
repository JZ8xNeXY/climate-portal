import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tokyo Climate Vision Map',
  description: '東京都気候変動予測データ視覚化アプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
