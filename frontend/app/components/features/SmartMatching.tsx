// components/features/SmartMatching.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaRobot } from 'react-icons/fa';

export default function SmartMatching() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push('/matching');
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full bg-yellow-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left group"
      aria-label="Learn more about Smart Matching"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-yellow-200 transition-colors">
          <FaRobot className="w-6 h-6 text-yellow-600 group-hover:text-yellow-700" />
        </div>
        {isLoading ? (
          <span className="text-yellow-600">Loading...</span>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-900">Smart Hi Matching</h3>
            <svg 
              className="w-5 h-5 ml-2 text-yellow-600 group-hover:text-yellow-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"

            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </div>
      <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
        AI-powered recommendations based on your preferences.
      </p>
    </button>
  );
}