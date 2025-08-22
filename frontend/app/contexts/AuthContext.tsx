"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { decodeJWTToken, isTokenValid, getUserRole } from '../utils/auth';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  investmentFirm?: string;
  investmentRange?: string;
  preferredSectors?: string;
  founderName?: string;
  startupName?: string;
  industrySector?: string;
  fundingStage?: string;
  companyDescription?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'investor' | 'startup') => Promise<boolean>;
  logout: () => void;
  register: (userData: any, role: 'investor' | 'startup') => Promise<boolean>;
  isAuthenticated: boolean;
  isInvestor: boolean;
  isStartup: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token && isTokenValid(token)) {
        const payload = decodeJWTToken(token);
        if (payload) {
          setUser({
            id: payload.user_id,
            username: payload.username,
            email: payload.username, // Using username as email
            role: payload.role,
          });
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: 'investor' | 'startup'): Promise<boolean> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    try {
      // Debug logging
      console.log('Login attempt:', {
        apiUrl,
        timestamp: new Date().toISOString(),
        email: email.slice(0, 3) + '***', // Log partial email for debugging
        role,
      });

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${apiUrl}/accounts/login/`, {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username: email, password, role }),
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON response:', responseText);
        throw new Error('Received an invalid response from the server.');
      }

      if (!response.ok) {
        console.error('Login failed response:', {
          status: response.status,
          statusText: response.statusText,
          data,
        });

        // The backend provides a 'detail' field with the specific error message.
        throw new Error(data.detail || `Login failed. Please try again.`);
      }

      if (data.access) {
        // Store token in both localStorage and cookie for redundancy
        localStorage.setItem('token', data.access);
        document.cookie = `token=${data.access}; path=/; max-age=86400`; // 24 hours
        
        const payload = decodeJWTToken(data.access);
        if (payload) {
          setUser({
            id: payload.user_id,
            username: payload.username,
            email: payload.username, // Using username as email since that's what we send
            role: payload.role,
          });
          return true;
        } else {
          throw new Error('Invalid token received from server');
        }
      } else {
        throw new Error('Invalid response from server: No access token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // First check if it's a network error
      if (error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        console.error('Network error detected');
        throw new Error(
          'Could not connect to the server. Please check:\n' +
          '1. The backend server is running\n' +
          '2. Your API URL is correct (current: ' + apiUrl + ')\n' +
          '3. You have a working internet connection'
        );
      }

      // Then handle other error types
      throw error; // Re-throw the original error to be caught by the calling component
    }
  };

  const logout = () => {
    // Clear all tokens and auth data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Clear the cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setUser(null);
    window.location.href = '/login'; // Use window.location for full page reload
  };

  const register = async (userData: any, role: 'investor' | 'startup'): Promise<boolean> => {
    try {
      const endpoint = role === 'investor'
        ? 'http://localhost:8000/api/accounts/register/investor/'
        : 'http://localhost:8000/api/accounts/register/startup/';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return response.ok;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isInvestor: user?.role === 'investor',
    isStartup: user?.role === 'startup',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};