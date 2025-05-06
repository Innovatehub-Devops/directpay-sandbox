
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
    
    console.log(`Attempting API call: ${method} ${apiUrl}`);
    
    // Define request options with proper CORS settings
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      // Remove credentials: 'include' as it can cause CORS issues
      mode: 'cors' // Explicitly set CORS mode
    };
    
    // Add detailed logging for request
    console.log('Request options:', {
      method,
      headers: requestOptions.headers,
      url: apiUrl,
      bodyLength: body ? JSON.stringify(body).length : 0
    });
    
    const response = await fetch(apiUrl, requestOptions);

    // Add detailed logging for response
    console.log(`Response received: Status ${response.status} ${response.statusText}`);
    
    // Try to parse the response as JSON
    let data;
    let responseText = '';
    
    try {
      // First try to get the text for debugging purposes
      responseText = await response.text();
      console.log('Response text:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
      
      // Then try to parse as JSON if not empty
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = {};
      }
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
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
    } else {
      console.log('API call successful:', endpoint);
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
