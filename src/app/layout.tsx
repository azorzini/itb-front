import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'APR Analysis Dashboard - IntoTheBlock',
  description: 'Analyze Annual Percentage Rates for Uniswap V2 pairs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
} 