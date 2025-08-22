// components/features/GlobalNetwork.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';

export default function GlobalNetwork() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    router.push('/network');
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left"
      aria-label="Learn more about Global Network"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <FaGlobe className="w-6 h-6 text-blue-600" />
        </div>
        {isLoading ? (
          <span className="text-blue-600">Loading...</span>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-900">Global Network</h3>
            <svg 
              className="w-5 h-5 ml-2 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </>
        )}
      </div>
      <p className="text-gray-600">
        Connect with investors and startups from around the world.
      </p>
    </button>
  );
}