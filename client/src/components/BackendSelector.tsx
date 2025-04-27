import { useEffect, useState } from 'react';
import { ApiBackend, ACTIVE_BACKEND } from '@/lib/apiConfig';
import { queryClient } from '@/lib/queryClient';

export default function BackendSelector() {
  const [backend, setBackend] = useState<ApiBackend>(ACTIVE_BACKEND);
  
  // Update local storage when backend changes
  useEffect(() => {
    localStorage.setItem('api_backend', backend);
    // Invalidate all queries to refresh data from new backend
    queryClient.invalidateQueries();
  }, [backend]);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-2 shadow-lg rounded-md text-sm z-50 opacity-70 hover:opacity-100 transition-opacity border border-gray-300 dark:border-gray-700">
      <div className="font-bold mb-1 text-gray-700 dark:text-gray-300">API Backend:</div>
      <select 
        value={backend}
        onChange={(e) => setBackend(e.target.value as ApiBackend)}
        className="text-sm py-1 px-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        <option value={ApiBackend.EXPRESS}>Express</option>
        <option value={ApiBackend.DJANGO_PROXY}>Django (Proxy)</option>
        <option value={ApiBackend.DJANGO}>Django (Direct)</option>
      </select>
    </div>
  );
}