'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAPRData } from '@/hooks/useAPRData'
import { usePairData } from '@/hooks/usePairData'
import { API_CONFIG } from '@/config/api'

const PAIR_OPTIONS = [
  {
    address: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
    name: 'USDC/WETH'
  },
  {
    address: '0xbc9d21652cca70f54351e3fb982c6b5dbe992a22',
    name: 'WETH/RKFL'
  }
]

const WINDOW_OPTIONS = [
  { value: 1 as const, label: '1H' },
  { value: 12 as const, label: '12H' },
  { value: 24 as const, label: '24H' }
]

// Improved number formatting
const formatCompactNumber = (num: number) => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
  return `$${num.toFixed(0)}`
}

const formatCompactAPR = (apr: number) => {
  if (apr >= 1000) return `${(apr / 1000).toFixed(1)}K%`
  if (apr >= 100) return `${apr.toFixed(0)}%`
  return `${apr.toFixed(2)}%`
}

const formatPercentage = (num: number, baseline: number = 0) => {
  const change = ((num - baseline) / baseline) * 100
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

interface MetricCardProps {
  title: string
  value: string
  change?: string
  changeColor?: 'green' | 'red' | 'gray'
}

function MetricCard({ title, value, change, changeColor = 'gray' }: MetricCardProps) {
  const colorClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 min-h-[80px] sm:min-h-[auto]">
      <h3 className="text-xs sm:text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-tight">{value}</p>
      {change && (
        <p className={`text-xs ${colorClasses[changeColor]} leading-tight`}>{change}</p>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [selectedPair, setSelectedPair] = useState(PAIR_OPTIONS[0].address)
  const [selectedWindow, setSelectedWindow] = useState<1 | 12 | 24>(24)

  const { data: aprData, loading: aprLoading, error: aprError, refetch } = useAPRData(selectedPair, selectedWindow)
  const { data: pairInfo, loading: pairLoading } = usePairData(selectedPair)

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Transform data for Recharts
  const chartData = aprData.map((point, index) => ({
    index,
    apr: point.apr,
    timestamp: point.timestamp,
    formattedTime: formatTimestamp(point.timestamp),
    feesUSD: point.feesUSD || 0,
    reserveUSD: point.reserveUSD || 0,
    volumeUSD: point.volumeUSD || 0,
    feeRate: point.feeRate || 0.003
  }))

  // Get latest data for metrics
  const latestData = aprData[aprData.length - 1]
  const firstData = aprData[0]

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs">
          <h4 className="font-medium text-gray-900 mb-2">APR Details</h4>
          <div className="space-y-1">
            <p><span className="text-gray-600">Time:</span> {data.formattedTime}</p>
            <p><span className="text-gray-600">APR:</span> <span className="font-bold text-blue-600">{formatCompactAPR(data.apr)}</span></p>
            <p><span className="text-gray-600">Fees:</span> {formatCompactNumber(data.feesUSD)}</p>
            <p><span className="text-gray-600">Liquidity:</span> {formatCompactNumber(data.reserveUSD)}</p>
          </div>
        </div>
      )
    }
    return null
  }

  const isDevelopment = process.env.NODE_ENV === 'development'
  const isUsingProxy = API_CONFIG.BACKEND_URL.includes('/api/proxy')

  return (
    <div className="w-full p-3 sm:p-4 md:p-6 lg:p-10">
      {/* Development Indicator */}
      {isDevelopment && isUsingProxy && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded-lg text-xs text-yellow-800">
          🔄 Development Mode: Using local proxy to avoid CORS issues
        </div>
      )}

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 mb-4 sm:mb-6">
        {/* Pair Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Uniswap V2 Pair
          </label>
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[44px]"
          >
            {PAIR_OPTIONS.map((pair) => (
              <option key={pair.address} value={pair.address}>
                {pair.name}
              </option>
            ))}
          </select>
        </div>

        {/* Window Selection - Radio Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moving Average Window
          </label>
          <div className="flex gap-2 sm:gap-3">
            {WINDOW_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedWindow(option.value)}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 text-sm font-medium rounded-lg border transition-colors min-h-[44px] ${
                  selectedWindow === option.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      {latestData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <MetricCard
            title="Current APR"
            value={formatCompactAPR(latestData.apr)}
            change={firstData ? formatPercentage(latestData.apr, firstData.apr) : undefined}
            changeColor={firstData && latestData.apr > firstData.apr ? 'green' : 'red'}
          />
          <MetricCard
            title="Total Fees"
            value={formatCompactNumber(latestData.feesUSD)}
            change={firstData ? formatPercentage(latestData.feesUSD, firstData.feesUSD) : undefined}
            changeColor={firstData && latestData.feesUSD > firstData.feesUSD ? 'green' : 'red'}
          />
          <MetricCard
            title="Avg Liquidity"
            value={formatCompactNumber(latestData.reserveUSD)}
            change={firstData ? formatPercentage(latestData.reserveUSD, firstData.reserveUSD) : undefined}
            changeColor={firstData && latestData.reserveUSD > firstData.reserveUSD ? 'green' : 'red'}
          />
          <MetricCard
            title="Volume (24h)"
            value={formatCompactNumber(latestData.volumeUSD)}
            change={`${(latestData.feeRate * 100).toFixed(1)}% fee`}
            changeColor="gray"
          />
        </div>
      )}

      {/* Chart Container */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 mb-4">
        {aprLoading ? (
          <div className="h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading APR data...</p>
            </div>
          </div>
        ) : aprError ? (
          <div className="h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-red-600 mb-2 text-sm">Error loading data:</p>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 break-words">{aprError}</p>
              <button
                onClick={refetch}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[44px] text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-48 sm:h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <p className="text-gray-600 text-sm">No APR data available</p>
          </div>
        ) : (
          <div>
            {/* Chart Info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600 gap-2">
              <span className="hidden sm:inline">Window: {selectedWindow}h moving average | Data points: {chartData.length}</span>
              <span className="sm:hidden">Window: {selectedWindow}h | Points: {chartData.length}</span>
              <span className="text-xs">Latest: {formatTimestamp(latestData?.timestamp || new Date().toISOString())}</span>
            </div>

            {/* Chart */}
            <div className="h-48 sm:h-64 md:h-80 lg:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="index"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value + 1}`}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => formatCompactAPR(value)}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="apr" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 