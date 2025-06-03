# ITB Challenge Dashboard

A React/Next.js application that analyzes Annual Percentage Rates (APR) for Uniswap V2 pairs with customizable moving average windows.

## Live Demo

[Click here](https://itb-front.netlify.app/)

## Features

- **APR Chart Visualization** - Interactive charts showing APR trends over time using Recharts
- **Moving Average Customization** - Choose between 1, 12, or 24-hour windows
- **Multiple Pair Support** - Analyze two USDC/WETH pairs
- **Real-time Data** - Live API connectivity with health monitoring
- **Responsive Design** - Modern UI built with Tailwind CSS
- **Professional Charts** - Built with Recharts for robust visualization

##  Architecture

### Frontend Stack
- **Next.js** 
- **TypeScript**
- **Tailwind CSS**
- **Recharts** 
- **Custom Hooks** 

### API Integration
- **Next.js Proxy** - Built-in API proxy to handle CORS
- **RESTful API** - Full CRUD operations
- **Health Monitoring** - Real-time service status
- **Error Handling** - Graceful degradation

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Running IntoTheBlock Uniswap Backend API

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd itb-front
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Create .env.local file
   echo "BACKEND_API_URL=http://localhost:3000" > .env.local
   
   # For production
   # echo "BACKEND_API_URL=https://your-app-name.railway.app" > .env.local
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3003](http://localhost:3003)


## 🔧 API Integration

The app uses a **Next.js API proxy** to handle CORS issues automatically. All requests go through `/api/proxy/*` which forwards to your backend.

### Core Endpoints
```typescript
// Proxied through Next.js
GET /api/proxy/health
GET /api/proxy/api/pairs/{pairAddress}/latest
GET /api/proxy/api/pairs/{pairAddress}/apr?window={hours}
GET /api/proxy/api/pairs/{pairAddress}?startDate={date}&endDate={date}&limit={number}
```

### Supported Pairs
- **Pair 1:** `0xbc9d21652cca70f54351e3fb982c6b5dbe992a22`
- **Pair 2:** `0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc`

## 🎣 Custom Hooks

### `useAPRData(pairAddress, window)`
Fetches APR data with moving average calculations.

```typescript
const { data, loading, error, meta, refetch } = useAPRData(
  '0xbc9d21652cca70f54351e3fb982c6b5dbe992a22',
  24
);
```

### `usePairData(pairAddress)`
Gets latest pair information and metrics.

```typescript
const { data, loading, error, refetch } = usePairData(
  '0xbc9d21652cca70f54351e3fb982c6b5dbe992a22'
);
```

### `useHistoricalData(params)`
Retrieves historical snapshots with filtering.

```typescript
const { data, loading, error, meta, refetch } = useHistoricalData({
  pairAddress: '0xbc9d21652cca70f54351e3fb982c6b5dbe992a22',
  startDate: '2024-01-01',
  limit: 100
});
```

### `useHealthCheck()`
Monitors API connectivity and service status.

```typescript
const { health, loading, error, isHealthy } = useHealthCheck();
```

### Project Structure
```
src/
├── app/
│   ├── api/proxy/[...path]/   # CORS proxy for backend
│   ├── dashboard/page.tsx     # Main dashboard
│   ├── apr/page.tsx           # APR analysis page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── APRChart.tsx           # Recharts chart component
│   ├── Dashboard.tsx          # Dashboard overview
│   ├── Header.tsx             # Page header
│   └── Sidebar.tsx            # Navigation sidebar
└── hooks/
    ├── useAPRData.ts          # APR data fetching
    ├── usePairData.ts         # Pair info fetching
    ├── useHistoricalData.ts   # Historical data
    └── useHealthCheck.ts      # API health monitoring
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Environment Variables
```bash
# Required - Backend API URL
BACKEND_API_URL=https://your-backend-api.railway.app

# For local development
BACKEND_API_URL=http://localhost:3000
```

### Build Commands
```bash
npm run build
npm run start
```