export async function checkServerStatus(): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const response = await fetch(`${apiUrl}/accounts/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Server status check failed:', error);
    return false;
  }
}
