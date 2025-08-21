import Image from 'next/image';
import { useState } from 'react';
import { FaEnvelope, FaLinkedin, FaUserPlus, FaComment } from 'react-icons/fa';
import { networkService } from '../services/networkService';

interface NetworkCardProps {
  id: number;
  name: string;
  role: string;
  company: string;
  description: string;
  imageUrl: string;
  linkedinUrl?: string;
  email?: string;
  onConnect?: () => void;
  onMessage?: () => void;
  isConnected?: boolean;
}

export default function NetworkCard({
  id,
  name,
  role,
  company,
  description,
  imageUrl,
  linkedinUrl,
  email,
  onConnect,
  onMessage,
  isConnected = false
}: NetworkCardProps) {
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(isConnected);

  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      setConnecting(true);

      // Debug logging
      console.log('Attempting to connect with user:', {
        userId: id,
        timestamp: new Date().toISOString()
      });

      const result = await networkService.connectWithUser(id);

      console.log('Connection response:', {
        userId: id,Q
        result,
        timestamp: new Date().toISOString()
      });

      setConnectionStatus(true);
      onConnect?.();
    } catch (error: unknown) {
      let errorString = '';
      try {
        errorString = JSON.stringify(error);
      } catch {
        errorString = String(error);
      }

      // Always log both raw error and errorString for diagnostics
      console.error('Raw connection error:', error);
      if (!error || (typeof error === 'object' && Object.keys(error).length === 0)) {
        console.error('Connection error (stringified):', errorString);
      }

      let errorMessage = 'Failed to connect with user. Please try again.';
      let errorDetails: any = {};

      if (error && typeof error === 'object') {
        if ('message' in error && typeof (error as any).message === 'string') {
          errorMessage = (error as { message: string }).message;
          errorDetails = error;
        } else if ('response' in error && (error as any).response?.data?.message) {
          errorMessage = (error as any).response.data.message;
          errorDetails = (error as any).response.data;
        } else if (error instanceof Error) {
          errorMessage = error.message;
          errorDetails = { name: error.name, stack: error.stack };
        } else if (Object.keys(error).length > 0) {
          errorDetails = error;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
        errorDetails = { error };
      } else {
        errorDetails = { error };
      }

      // Fallback if errorDetails is still empty
      if (!errorDetails || (typeof errorDetails === 'object' && Object.keys(errorDetails).length === 0)) {
        errorDetails = { errorString };
      }

      console.error('Connection error:', {
        error: errorDetails,
        errorString,
        userId: id,
        errorMessage,
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined
      });

      setError(errorMessage);

      // Handle authentication errors
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        typeof (error as { status: number }).status === 'number' &&
        (error as { status: number }).status === 401
      ) {
        console.log('Authentication required, redirecting to login...');
        window.location.href = '/login';
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleMessage = () => {
    onMessage?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-gray-600">{role} at {company}</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-3">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FaLinkedin className="mr-2" />
              LinkedIn
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaEnvelope className="mr-2" />
              Email
            </a>
          )}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleConnect}
              disabled={connectionStatus || connecting}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                connectionStatus
                  ? 'bg-green-100 text-green-600'
                  : error
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              <FaUserPlus className="mr-2" />
              {connectionStatus 
                ? 'Connected' 
                : connecting 
                ? 'Connecting...' 
                : error 
                ? 'Retry Connection' 
                : 'Connect'}
            </button>
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          <button
            onClick={handleMessage}
            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <FaComment className="mr-2" />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
