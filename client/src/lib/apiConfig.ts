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
  [ApiBackend.DJANGO]: '/django-api',  // Using Django proxied through Express for better CORS handling
  [ApiBackend.DJANGO_PROXY]: '/django-api'  // Django API proxied through Express
};

// Get backend from localStorage or default to DJANGO
const getStoredBackend = (): ApiBackend => {
  if (typeof window !== 'undefined') {
    // 一時的にAPIバックエンドをDjangoに設定
    localStorage.setItem('api_backend', ApiBackend.DJANGO);
    
    const stored = localStorage.getItem('api_backend');
    if (stored && Object.values(ApiBackend).includes(stored as ApiBackend)) {
      return stored as ApiBackend;
    }
  }
  return ApiBackend.DJANGO;
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
  
  // Log the API URL construction for debugging
  console.log(`Building API URL for ${ACTIVE_BACKEND}:`, endpoint);
  
  // Handle different backend URL patterns
  switch (ACTIVE_BACKEND) {
    case ApiBackend.DJANGO:
      // For direct Django access
      // Ensure we're using the proper path format
      if (!endpoint.startsWith('/api/')) {
        const apiUrl = `${baseUrl}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        console.log('Final Django URL:', apiUrl);
        return apiUrl;
      }
      console.log('Final Django URL:', `${baseUrl}${endpoint}`);
      return `${baseUrl}${endpoint}`;
      
    case ApiBackend.DJANGO_PROXY:
      // プロキシ経由でDjangoにアクセスする場合の処理
      // エンドポイントはそのまま保持する（サーバー側でプロキシが処理）
      const apiUrl = `${baseUrl}${endpoint}`;
      console.log('Final Django-proxy URL:', apiUrl);
      return apiUrl;
      
    case ApiBackend.EXPRESS:
    default:
      // For Express, keep the endpoint as is (it already has /api/)
      console.log('Final Express URL:', `${baseUrl}${endpoint}`);
      return `${baseUrl}${endpoint}`;
  }
};