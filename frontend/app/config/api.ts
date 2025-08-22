// API Configuration for connecting to Django backend

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const RECOMMENDER_URL = process.env.NEXT_PUBLIC_RECOMMENDER_URL || 'http://localhost:8001';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/accounts/login/`,
  SIGNUP: `${API_BASE_URL}/api/accounts/signup/`,
  LOGOUT: `${API_BASE_URL}/api/accounts/logout/`,
  
  // User Management
  USER_PROFILE: `${API_BASE_URL}/api/accounts/profile/`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/accounts/profile/update/`,
  
  // Investment Data
  INVESTMENTS: `${API_BASE_URL}/api/investments/`,
  OPPORTUNITIES: `${API_BASE_URL}/api/opportunities/`,
  PORTFOLIO: `${API_BASE_URL}/api/portfolio/`,
  
  // Messages
  MESSAGES: `${API_BASE_URL}/api/messages/`,
  SEND_MESSAGE: `${API_BASE_URL}/api/messages/send/`,

  // AI Recommender
  RECOMMENDER_BASE: RECOMMENDER_URL,
  PREDICT_COMPATIBILITY: `${RECOMMENDER_URL}/predict_compatibility/`,
  PREDICT_TRACTION: `${RECOMMENDER_URL}/predict_traction/`,
  SECTOR_SIMILARITY: `${RECOMMENDER_URL}/sector_similarity/`,
};

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to make API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(endpoint, config);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}
