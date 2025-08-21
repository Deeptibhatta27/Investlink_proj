// components/features/PreciseTargeting.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaCrosshairs } from 'react-icons/fa';

export default function PreciseTargeting() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push('/targeting');
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full bg-red-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left group"
      aria-label="Learn more about Precise Targeting"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
          <FaCrosshairs className="w-6 h-6 text-red-600 group-hover:text-red-700" />
        </div>
        {isLoading ? (
          <span className="text-red-600">Loading...</span>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-900">Precise Targeting</h3>
            <svg 
              className="w-5 h-5 ml-2 text-red-600 group-hover:text-red-700" 
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
        Find exactly what you're looking for with advanced filters.
      </p>
    </button>
  );
}