'use client'

import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';

interface APRData {
  timestamp: string;
  apr: number;
  windowHours: number;
  reserveUSD: number;
  volumeUSD: number;
  feesUSD: number;
  feeRate: number;
}

interface APRResponse {
  success: boolean;
  data: APRData[];
  message: string;
}

interface UseAPRDataResult {
  data: APRData[];
  loading: boolean;
  error: string | null;
  meta: any | null;
  refetch: () => void;
}

export function useAPRData(
  pairAddress: string, 
  window: 1 | 12 | 24 = 24
): UseAPRDataResult {
  const [data, setData] = useState<APRData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the deployed backend directly
      const response = await fetch(
        `${API_CONFIG.BACKEND_URL}/api/pairs/${pairAddress}/apr?window=${window}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: APRResponse = await response.json();
      
      if (!result.success) {
        throw new Error('API returned unsuccessful response');
      }
      
      setData(result.data);
      setMeta(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pairAddress) {
      fetchData();
    }
  }, [pairAddress, window]);

  return { data, loading, error, meta, refetch: fetchData };
} 