'use client'

import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';

interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  database: string;
  api: string;
}

interface UseHealthCheckResult {
  health: HealthStatus | null;
  loading: boolean;
  error: string | null;
  isHealthy: boolean;
}

export function useHealthCheck(): UseHealthCheckResult {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the deployed backend directly
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const healthData: HealthStatus = await response.json();
      setHealth(healthData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health check failed');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const isHealthy = health?.status === 'OK' && health?.database === 'connected' && health?.api === 'working';

  return { health, loading, error, isHealthy };
} 