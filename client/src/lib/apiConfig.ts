// API Configuration File
export const DJANGO_API_BASE_URL = 'http://0.0.0.0:8001';
export const EXPRESS_API_BASE_URL = '/api';

// Set this to true to use the Django backend, false to use Express
export const USE_DJANGO_BACKEND = false;

// Get the appropriate base URL based on the configuration
export const getApiBaseUrl = () => {
  return USE_DJANGO_BACKEND ? DJANGO_API_BASE_URL : EXPRESS_API_BASE_URL;
};

// Build full URL for API endpoints
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  
  // For Django, ensure endpoint starts with /api/
  if (USE_DJANGO_BACKEND && !endpoint.startsWith('/api/')) {
    return `${baseUrl}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
  
  // For Express or already formatted Django endpoints
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};