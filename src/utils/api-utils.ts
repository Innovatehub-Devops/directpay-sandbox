
export interface ApiResponse {
  data: any;
  status: number;
  endpoint: string;
  method: string;
  timestamp: string;
}

export const callApi = async (apiBaseUrl: string, endpoint: string, method: string, body?: any, headers?: any): Promise<ApiResponse> => {
  try {
    let apiUrl = `${apiBaseUrl}${endpoint}`;
    
    console.log(`Calling API: ${method} ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    
    return {
      data,
      status: response.status,
      endpoint,
      method,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("API call failed:", error);
    
    return {
      data: { error: error instanceof Error ? error.message : "Unknown error" },
      status: 500,
      endpoint,
      method,
      timestamp: new Date().toISOString()
    };
  }
};
