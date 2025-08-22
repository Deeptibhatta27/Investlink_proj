const testEndpoints = [
  '/accounts/login/',
  '/accounts/',
  '/health/'  // Add this endpoint to your Django backend
];

export async function testApiConnection(apiUrl: string): Promise<{ 
  success: boolean; 
  error?: string;
  details?: {
    endpoint: string;
    status: number;
    ok: boolean;
  }[];
}> {
  try {
    const results = await Promise.all(
      testEndpoints.map(async endpoint => {
        try {
          const response = await fetch(`${apiUrl}${endpoint}`, {
            method: 'HEAD',
            mode: 'cors',
            headers: {
              'Accept': 'application/json'
            }
          });

          return {
            endpoint,
            status: response.status,
            ok: response.ok
          };
        } catch (error) {
          return {
            endpoint,
            status: 0,
            ok: false
          };
        }
      })
    );

    const anySuccess = results.some(result => result.ok);
    
    if (!anySuccess) {
      return {
        success: false,
        error: 'Could not connect to any API endpoints',
        details: results
      };
    }

    return {
      success: true,
      details: results
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
