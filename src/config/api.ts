// API Configuration
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

export const API_CONFIG = {
  // Direct backend URL for all environments
  BACKEND_URL: 'https://itb-back.up.railway.app',
  DIRECT_BACKEND_URL: 'https://itb-back.up.railway.app',
  ENDPOINTS: {
    HEALTH: '/health',
    PAIRS: '/api/pairs',
  }
} as const;

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>) => {
  let url = `${API_CONFIG.BACKEND_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString());
    });
    url += `?${searchParams.toString()}`;
  }
  
  return url;
}; 