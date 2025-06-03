'use client'

import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';

interface PairSnapshot {
  _id: string;
  pairAddress: string;
  timestamp: string;
  reserveUSD: number;
  volumeUSD: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Removed blockNumber, token0Symbol, token1Symbol, token0Reserve, token1Reserve as they're not in the actual API response
}

interface PairResponse {
  success: boolean;
  data: PairSnapshot;
}

interface UsePairDataResult {
  data: PairSnapshot | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePairData(pairAddress: string): UsePairDataResult {
  const [data, setData] = useState<PairSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the deployed backend directly
      const response = await fetch(
        `${API_CONFIG.BACKEND_URL}/api/pairs/${pairAddress}/latest`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: PairResponse = await response.json();
      
      if (!result.success) {
        throw new Error('API returned unsuccessful response');
      }
      
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pairAddress) {
      fetchData();
    }
  }, [pairAddress]);

  return { data, loading, error, refetch: fetchData };
}