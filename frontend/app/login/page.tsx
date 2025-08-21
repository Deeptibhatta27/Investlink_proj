// app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";
import { testApiConnection } from "../utils/apiTest";
import { FaUserTie, FaRocket, FaExclamationTriangle } from 'react-icons/fa';

// A simple Alert component for displaying messages
const Alert = ({ message, type }: { message: string; type: 'success' | 'error' }) => {
  if (!message) return null;

  const baseClasses = "p-4 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2";
  const typeClasses = type === 'success'
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {type === 'error' && <FaExclamationTriangle />}
      <span>{message}</span>
    </div>
  );
};


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'investor' | 'startup'>('investor');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();

  // Get the redirect URL from query parameters
  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    setIsLoading(true);

    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const apiTest = await testApiConnection(apiUrl);
      
      if (!apiTest.success) {
        console.error('API Connection Test Results:', apiTest);
        throw new Error(
          'Cannot connect to the server. Please verify the backend server is running and the API URL is correct.'
        );
      }

      const success = await login(email, password, role);
      
      if (success) {
        setMessage('Login successful! Redirecting...');
        setIsSuccess(true);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (redirectUrl) {
          router.push(decodeURIComponent(redirectUrl));
        } else {
          // Auto-redirect based on role from the authenticated user context
          if (user?.role === 'investor') {
            router.push('/investor/dashboard');
          } else if (user?.role === 'startup') {
            router.push('/startup/dashboard');
          } else {
            router.push('/');
          }
        }
      } else {
        // This case might not be reached if login function always throws on failure
        setMessage('Login failed. Please check your credentials and selected role.');
        setIsSuccess(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setMessage(error.message || 'An unexpected error occurred. Please try again.');
      setIsSuccess(false);
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to InvestLink</p>
        </div>

        {/* Alert for messages */}
        <div className="mb-4">
          <Alert message={message} type={isSuccess ? 'success' : 'error'} />
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex rounded-lg bg-gray-200 p-1">
            <button
              onClick={() => setRole('investor')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${role === 'investor' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}
            >
              <FaUserTie />
              Investor
            </button>
            <button
              onClick={() => setRole('startup')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${role === 'startup' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}
            >
              <FaRocket />
              Startup
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                id="remember"
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <div className="flex items-center my-8">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
}
