'use client'

import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';

interface PairSnapshot {
  _id: string;
  pairAddress: string;
  timestamp: string;
  reserveUSD: number;
  volumeUSD: number;
  blockNumber: number;
  token0Symbol?: string;
  token1Symbol?: string;
  token0Reserve?: string;
  token1Reserve?: string;
}

interface HistoricalResponse {
  success: boolean;
  data: PairSnapshot[];
  meta: {
    total: number;
    limit: number;
    startDate?: string;
    endDate?: string;
  };
}

interface HistoricalDataParams {
  pairAddress: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

interface UseHistoricalDataResult {
  data: PairSnapshot[];
  loading: boolean;
  error: string | null;
  meta: HistoricalResponse['meta'] | null;
  refetch: () => void;
}

export function useHistoricalData(params: HistoricalDataParams): UseHistoricalDataResult {
  const [data, setData] = useState<PairSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<HistoricalResponse['meta'] | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      // Use the deployed backend directly
      const response = await fetch(
        `${API_CONFIG.BACKEND_URL}/api/pairs/${params.pairAddress}?${queryParams}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: HistoricalResponse = await response.json();
      
      if (!result.success) {
        throw new Error('API returned unsuccessful response');
      }
      
      setData(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.pairAddress) {
      fetchData();
    }
  }, [params.pairAddress, params.startDate, params.endDate, params.limit]);

  return { data, loading, error, meta, refetch: fetchData };
} 