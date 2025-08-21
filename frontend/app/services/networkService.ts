import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Message {
  id: number;
  sender: number;
  recipient: number;
  content: string;
  timestamp: string;
  read: boolean;
  sender_username?: string;
  recipient_username?: string;
}

export interface NetworkMember {
  id: number;
  name: string;
  role: string;
  company: string;
  description: string;
  imageUrl: string;
  type: 'investor' | 'startup';
  industry?: string;
  location?: string;
  linkedinUrl?: string;
  email?: string;
  investmentRange?: string;
  matchScore?: number;
  preferredSectors?: string[];
  portfolio?: number;
  totalInvestments?: string;
  successfulExits?: number;
  fundingStage?: string;
  marketSize?: string;
  revenueRange?: string;
  teamSize?: string;
}

interface NetworkResponse {
  data: NetworkMember[];
  message?: string;
  status: number;
}

export interface NetworkFilters {
  type?: 'all' | 'investor' | 'startup';
  industry?: string;
  location?: string;
  search?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

const api = axios.create({
  baseURL: API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // This is important for handling cookies if you're using session auth
  timeout: 10000, // 10 second timeout
  // Retry configuration
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  // Add metadata to help with debugging
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': '1.0.0',
    'X-Request-ID': () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
});

// Add request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  // Try to get token from both localStorage and cookie
  const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/accounts/token/refresh/`);
        const { token } = response.data;
        
        // Store the new token
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=86400`; // 24 hours
        
        // Update the authorization header
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Custom error type guard
function isAxiosError(error: any): error is import('axios').AxiosError {
  return error.isAxiosError === true;
}

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Network Error handling
    if (!error.response) {
      const networkError = {
        message: 'Unable to connect to the server. Please check your internet connection.',
        status: 0,
        details: error
      };
      return Promise.reject(networkError);
    }

    // Unauthorized handling (401)
    if (error.response.status === 401) {
      // Try to refresh token
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {
            refresh: refreshToken
          });
          
          if (response.data.access) {
            localStorage.setItem('token', response.data.access);
            error.config.headers['Authorization'] = `Bearer ${response.data.access}`;
            return api.request(error.config);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If refresh fails or no refresh token, redirect to login
      window.location.href = '/login';
      return Promise.reject({
        message: 'Please login to continue',
        status: 401
      });
    }

    // Handle API errors
    const errorResponse = {
      message: error.response.data?.message || error.response.data?.detail || 'An error occurred',
      status: error.response.status,
      details: error.response.data
    };

    return Promise.reject(errorResponse);
  }
);

const mockData: NetworkMember[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Investment Manager',
    company: 'Tech Ventures Capital',
    description: 'Focused on early-stage tech startups with expertise in AI and blockchain investments.',
    imageUrl: '/profile-placeholder.jpg',
    type: 'investor',
    industry: 'Technology',
    location: 'San Francisco',
    linkedinUrl: 'https://linkedin.com',
    email: 'sarah@techventures.com'
  },
  {
    id: 2,
    name: 'Alex Chen',
    role: 'Founder & CEO',
    company: 'HealthTech Solutions',
    description: 'Building AI-powered healthcare diagnostics platform for remote patient monitoring.',
    imageUrl: '/profile-placeholder.jpg',
    type: 'startup',
    industry: 'Healthcare',
    location: 'Boston',
    linkedinUrl: 'https://linkedin.com',
    email: 'alex@healthtech.com'
  }
];

type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
      detail?: string;
      error?: string;
      [key: string]: unknown;
    };
    status?: number;
  };
  message?: string;
  code?: string;
};

function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return typeof error === 'object' && error !== null && (
    'response' in error ||
    'message' in error ||
    'code' in error
  );
}

function handleServiceError(error: unknown): ApiError {
  let message = 'An unknown error occurred';
  let status = 500;
  let details = undefined;

  if (isAxiosError(error)) {
    const errorData = error.response?.data as { message?: string; detail?: string; error?: string } | undefined;
    status = error.response?.status || status;
    if (status === 401) {
      message = 'Please login to continue';
    } else if (errorData?.message) {
      message = errorData.message;
    } else if (errorData?.detail) {
      message = errorData.detail;
    } else if (errorData?.error) {
      message = errorData.error;
    } else if (error.message) {
      message = error.message;
    }
    details = error.response?.data;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return { message, status, details };
}

// Helper functions
const buildQueryParams = (filters: NetworkFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') {
    params.append('type', filters.type);
  }
  if (filters.industry) {
    params.append('industry', filters.industry);
  }
  if (filters.location) {
    params.append('location', filters.location);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  return params;
};

const filterMockData = (mockData: NetworkMember[], filters: NetworkFilters): NetworkMember[] => {
  return mockData.filter(member => {
    if (filters.type && filters.type !== 'all' && member.type !== filters.type) {
      return false;
    }
    if (filters.industry && member.industry !== filters.industry) {
      return false;
    }
    if (filters.location && member.location && 
        !member.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        member.name.toLowerCase().includes(search) ||
        member.company.toLowerCase().includes(search) ||
        member.description.toLowerCase().includes(search)
      );
    }
    return true;
  });
};

interface Post {
  id: string;
  author: {
    id: number;
    name: string;
    role: string;
    company: string;
    imageUrl: string;
  };
  content: string;
  attachments?: {
    type: 'image' | 'link';
    url: string;
    title?: string;
    description?: string;
  }[];
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
}

export const networkService = {
  getNetworkMembers: async function(filters: NetworkFilters): Promise<NetworkMember[]> {
    try {
      const params = buildQueryParams(filters);
      const response = await api.get<NetworkResponse>('/accounts/network/', {
        params,
        timeout: 5000
      });

      if (!response?.data?.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response format from API');
      }

      return response.data.data;
    } catch (error: unknown) {
      // Log the API error in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('API request failed:', error);
      }
      
      // In development, fall back to mock data
      if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_URL) {
        return filterMockData(mockData, filters);
      }
      
      throw handleServiceError(error);
    }
  },

  getNetworkPosts: async function(params?: { page?: number; limit?: number }): Promise<Post[]> {
    try {
      const response = await api.get<{ data: Post[] }>('/network/posts/', { params });
      return response.data.data;
    } catch (error: unknown) {
      throw handleServiceError(error);
    }
  },

  createPost: async function(data: { content: string; attachments?: any[] }): Promise<Post> {
    try {
      const response = await api.post<{ data: Post }>('/network/posts/', data);
      return response.data.data;
    } catch (error: unknown) {
      throw handleServiceError(error);
    }
  },

  toggleLikePost: async function(postId: string): Promise<void> {
    try {
      await api.post(`/network/posts/${postId}/like/`);
    } catch (error: unknown) {
      throw handleServiceError(error);
    }
  },

  toggleSavePost: async function(postId: string): Promise<void> {
    try {
      await api.post(`/network/posts/${postId}/save/`);
    } catch (error: unknown) {
      throw handleServiceError(error);
    }
  },

  connectWithUser: async function(userId: number): Promise<void> {
    try {
      const response = await api.post<{message: string}>(`/accounts/network/connect/${userId}/`);
      if (!response.data?.message) {
        throw new Error('Invalid response format');
      }
    } catch (error: unknown) {
      // Always throw the full error object for better diagnostics
      const handled = handleServiceError(error);
      throw handled;
    }
  },

  getUserProfile: async function(userId: number): Promise<NetworkMember> {
    try {
      const response = await api.get<NetworkMember>(`/users/${userId}/`);
      return response.data;
    } catch (error: unknown) {
      throw handleServiceError(error);
    }
  },

  updateProfile: async function(userId: number, data: any): Promise<any> {
    try {
      const response = await api.patch(`/users/${userId}/`, data);
      return response.data;
    } catch (error: unknown) {
      throw handleServiceError(error);
    }
  },

  getMessages: async function(otherUserId: number): Promise<Message[]> {
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: unknown;

    while (retryCount < maxRetries) {
      try {
        console.log(`Fetching messages for user ${otherUserId}, attempt ${retryCount + 1}`);
        
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Make the request with explicit headers
        const response = await api.get(`/messages/with_user/?user_id=${otherUserId}`, {
          timeout: 5000,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          validateStatus: (status) => status === 200
        });

        // Debug log the response
        console.log('Messages API response:', {
          status: response.status,
          headers: response.headers,
          dataType: typeof response.data,
          isArray: Array.isArray(response.data)
        });

        // Validate response data
        if (!response.data) {
          throw new Error('Empty response from server');
        }

        // Handle both array response and data wrapper response
        const messagesData = Array.isArray(response.data) ? response.data : response.data.data;
        
        if (!Array.isArray(messagesData)) {
          throw new Error('Invalid response format: messages data is not an array');
        }

        // Validate and transform each message
        const messages = messagesData.map((msg, index) => {
          if (!msg.id || !msg.sender || !msg.recipient || !msg.content) {
            throw new Error(`Invalid message format at index ${index}`);
          }

          return {
            id: msg.id,
            sender: msg.sender,
            recipient: msg.recipient,
            content: msg.content,
            timestamp: msg.timestamp || new Date().toISOString(),
            read: msg.read || false,
            sender_username: msg.sender_username,
            recipient_username: msg.recipient_username
          };
        });

        return messages;
      } catch (error: unknown) {
        lastError = error;
        let errorString = '';
        try {
          errorString = JSON.stringify(error);
        } catch {
          errorString = String(error);
        }
        console.error(`Message fetch attempt ${retryCount + 1} failed:`, {
          error,
          errorString,
          userId: otherUserId,
          timestamp: new Date().toISOString(),
          stack: error instanceof Error ? error.stack : undefined
        });

        // Check if we should retry
        if (
          error instanceof Error &&
          (error.message.includes('network') || error.message.includes('timeout'))
        ) {
          retryCount++;
          if (retryCount < maxRetries) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            continue;
          }
        } else if (error instanceof Error && error.message.includes('authentication')) {
          // Don't retry auth errors, redirect to login
          window.location.href = '/login';
          break;
        } else {
          // Don't retry other types of errors
          break;
        }
      }
    }

    // If we get here, all retries failed
    throw handleServiceError(lastError || new Error('Failed to fetch messages after multiple attempts'));
  },

  sendMessage: async function(receiverId: number, message: string): Promise<{ id: number; timestamp: string }> {
    try {
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      // Add request timeout
      const response = await api.post('/messages/', {
        recipient: receiverId,
        content: message.trim(),
      }, {
        timeout: 5000,
        validateStatus: (status) => status === 200 || status === 201
      });

      // Validate response data
      if (!response.data || !response.data.id || !response.data.timestamp) {
        throw new Error('Invalid response format from server');
      }

      return response.data;
    } catch (error: unknown) {
      console.error('Error sending message:', {
        error,
        receiverId,
        messageLength: message.length,
        timestamp: new Date().toISOString()
      });
      throw handleServiceError(error);
    }
  },

  uploadPitch: async function(data: FormData): Promise<any> {
    try {
      const response = await api.post('/pitches/upload/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: unknown) {
      throw handleServiceError(error);
    }
  },

  getPitches: async function(filters?: any): Promise<any> {
    try {
      const response = await api.get('/pitches/', { params: filters });
      return response.data;
    } catch (error: unknown) {
      throw handleServiceError(error);
    }
  }
};
