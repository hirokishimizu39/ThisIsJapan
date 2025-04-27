import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { buildApiUrl } from "./apiConfig";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    // Build proper URL based on configuration
    const apiUrl = url.startsWith('http') ? url : buildApiUrl(url);
    
    console.log(`Sending ${method} request to: ${apiUrl}`);
    
    const res = await fetch(apiUrl, {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        // Add CORS headers
        "Accept": "application/json"
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      mode: "cors"
    });
    
    console.log(`Response status: ${res.status}`);
    
    if (!res.ok) {
      // エラー応答のボディを取得して出力
      const errorText = await res.text();
      console.error(`API Error (${res.status}):`, errorText);
      throw new Error(`API エラー: ${res.status} ${res.statusText}`);
    }
    
    return res;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      // Build proper URL based on configuration
      const endpoint = queryKey[0] as string;
      const apiUrl = endpoint.startsWith('http') ? endpoint : buildApiUrl(endpoint);
      
      console.log(`Sending GET query to: ${apiUrl}`);
      
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          "Accept": "application/json"
        },
        credentials: "include",
        mode: "cors"
      });
      
      console.log(`Response status: ${res.status}`);
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log("Unauthorized, returning null as requested.");
        return null;
      }
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API Error (${res.status}):`, errorText);
        throw new Error(`API エラー: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("Query response data:", data);
      return data;
    } catch (error) {
      console.error("Query failed:", error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
