// API Configuration File

// API backends
export enum ApiBackend {
  EXPRESS = 'express',
  DJANGO = 'django',
  DJANGO_PROXY = 'django-proxy'
}

// Backend URLs
export const API_URLS = {
  [ApiBackend.EXPRESS]: '',  // Empty to use relative paths
  [ApiBackend.DJANGO]: 'http://0.0.0.0:8001',  // Direct Django connection (may not work in Replit)
  [ApiBackend.DJANGO_PROXY]: '/django-api'  // Django API proxied through Express
};

// Get backend from localStorage or default to EXPRESS
const getStoredBackend = (): ApiBackend => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('api_backend');
    if (stored && Object.values(ApiBackend).includes(stored as ApiBackend)) {
      return stored as ApiBackend;
    }
  }
  return ApiBackend.EXPRESS;
};

// Select which backend to use (EXPRESS, DJANGO, or DJANGO_PROXY)
export const ACTIVE_BACKEND = getStoredBackend();

// Get the appropriate base URL based on the selected backend
export const getApiBaseUrl = () => {
  return API_URLS[ACTIVE_BACKEND];
};

// Build full URL for API endpoints
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  
  // Handle different backend URL patterns
  switch (ACTIVE_BACKEND) {
    case ApiBackend.DJANGO:
      // For direct Django access, ensure endpoint starts with /api/
      if (!endpoint.startsWith('/api/')) {
        return `${baseUrl}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      }
      return `${baseUrl}${endpoint}`;
      
    case ApiBackend.DJANGO_PROXY:
      // For Django proxy access, strip /api/ if it exists since it's already in the proxy URL
      if (endpoint.startsWith('/api/')) {
        const path = endpoint.substring(4); // Remove '/api'
        return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
      }
      return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      
    case ApiBackend.EXPRESS:
    default:
      // For Express, keep the endpoint as is (it already has /api/)
      return `${baseUrl}${endpoint}`;
  }
};