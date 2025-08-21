"use client";

import React from 'react';
import Logo from '../components/Logo';

export default function TestChatbotPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Chatbot Test Page
          </h1>
          <p className="text-gray-600 mt-2">
            Look for the floating chat icon in the bottom-right corner
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🤖 Chatbot Features
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Floating chat icon with professional design</li>
            <li>✅ Hover effects and animations</li>
            <li>✅ Notification dot to attract attention</li>
            <li>✅ Tooltip on hover</li>
            <li>✅ Integrated with your Botpress chatbot</li>
            <li>✅ Available on all pages</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🎯 How to Test
          </h2>
          <ol className="space-y-2 text-gray-700 list-decimal list-inside">
            <li>Look for the blue chat icon in the bottom-right corner</li>
            <li>Hover over it to see the tooltip</li>
            <li>Click the icon to open the chatbot</li>
            <li>Test the conversation with your bot</li>
            <li>Navigate to other pages to see it's available everywhere</li>
          </ol>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Pro Tips
          </h3>
          <ul className="text-blue-800 space-y-1">
            <li>• The chatbot is now available on every page of your application</li>
            <li>• Users can get help anytime without leaving the page</li>
            <li>• The design matches your InvestLink branding</li>
            <li>• Mobile-friendly and responsive</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 