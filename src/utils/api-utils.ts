
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
    
    // Define request options with proper CORS settings
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // Include cookies for CSRF tokens
      mode: 'cors' // Explicitly set CORS mode
    };
    
    const response = await fetch(apiUrl, requestOptions);

    // Try to parse the response as JSON
    let data;
    let responseText = '';
    
    try {
      // First try to get the text for debugging purposes
      responseText = await response.text();
      
      // Then try to parse as JSON if not empty
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = {};
      }
    } catch (e) {
      console.error("Failed to parse response:", responseText);
      data = { error: "Could not parse response as JSON", rawResponse: responseText };
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
      apiResponse.errorMessage = data.error || data.message || `HTTP Error ${response.status}`;
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
