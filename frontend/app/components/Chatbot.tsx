"use client";

import React, { useEffect, useState } from 'react';
import { FaComments, FaQuestionCircle } from 'react-icons/fa';

const recommendedMessages = [
  "How can I invest?",
  "Show me trending startups",
  "How does InvestLink work?",
  "Contact support"
];

const Chatbot: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Botpress scripts
    const loadBotpress = () => {
      if (document.querySelector('script[src*="botpress"]')) {
        setIsLoaded(true);
        return;
      }
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
      script1.defer = true;
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://files.bpcontent.cloud/2025/08/06/11/20250806111832-QKCP5D6H.js';
        script2.defer = true;
        script2.onload = () => {
          setIsLoaded(true);
        };
        document.head.appendChild(script2);
      };
      document.head.appendChild(script1);
    };
    loadBotpress();
    return () => {
      const scripts = document.querySelectorAll('script[src*="botpress"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  // Open chat and send recommended quick replies
  const openChatWithSuggestions = () => {
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: 'show' });
      setTimeout(() => {
        window.botpressWebChat.sendEvent({
          type: 'proactive-trigger',
          payload: {
            text: "Here are some things you can ask me:",
            suggestions: recommendedMessages
          }
        });
      }, 500);
    }
  };

  // Second icon: FAQ or Contact Support (can be customized)
  const openFAQ = () => {
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: 'show' });
      setTimeout(() => {
        window.botpressWebChat.sendEvent({
          type: 'proactive-trigger',
          payload: {
            text: "Here are some frequently asked questions:",
            suggestions: [
              "What is InvestLink?",
              "How do I register as a startup?",
              "How do I contact support?"
            ]
          }
        });
      }, 500);
    }
  };

  return (
    <>
      {/* Floating Chat Icons - stacked vertically */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {/* Main Chat Button */}
        <div className="cursor-pointer group" onClick={openChatWithSuggestions}>
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
              <FaComments className="text-white text-xl" />
            </div>
            <div className="absolute inset-0 w-14 h-14 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Need help? Chat with us!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
        {/* FAQ/Support Button */}
        <div className="cursor-pointer group" onClick={openFAQ}>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
              <FaQuestionCircle className="text-white text-lg" />
            </div>
            <div className="absolute inset-0 w-12 h-12 bg-purple-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            FAQ & Support
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white animate-spin">
            <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
          </div>
        )}
      </div>
      {/* Botpress Webchat Container */}
      <div id="bp-web-widget-container"></div>
    </>
  );
};

export default Chatbot; 