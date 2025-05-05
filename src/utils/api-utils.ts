
export interface ApiResponse {
  data: any;
  status: number;
  endpoint: string;
  method: string;
  timestamp: string;
  errorMessage?: string;
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
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include' // Include cookies for CSRF tokens
    });

    // Try to parse the response as JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { error: "Could not parse response as JSON" };
    }
    
    // Create the API response object
    const apiResponse: ApiResponse = {
      data,
      status: response.status,
      endpoint,
      method,
      timestamp: new Date().toISOString()
    };

    // Add error message for non-2xx responses
    if (!response.ok) {
      apiResponse.errorMessage = data.error || `HTTP Error ${response.status}`;
      console.error(`API Error: ${apiResponse.errorMessage}`, data);
    }
    
    return apiResponse;
  } catch (error) {
    console.error("API call failed:", error);
    
    return {
      data: { error: error instanceof Error ? error.message : "Unknown error" },
      status: 500,
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : "Network error"
    };
  }
};
