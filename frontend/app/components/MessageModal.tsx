import { useState, useEffect, useRef } from 'react';
import { networkService } from '../services/networkService';
import { websocketService } from '../services/websocketService';
import { FaPaperPlane, FaTimes, FaWifi } from 'react-icons/fa';
import { FiWifiOff } from 'react-icons/fi';

interface Message {
  id: number;
  sender: number;
  recipient: number;
  content: string;
  timestamp: string;
  read: boolean;
  sender_username?: string;
  recipient_username?: string;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: number;
  recipientName: string;
  currentUserId: number;
}

export default function MessageModal({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  currentUserId,
}: MessageModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      // Load initial messages
      loadMessages();
      
      // Connect to WebSocket
      const token = localStorage.getItem('token');
      if (token) {
        websocketService.connect(currentUserId, token);
      }
      
      // Subscribe to WebSocket events
      const handleMessage = (message: any) => {
        // Only add messages from the current recipient or sent by current user to this recipient
        if (
          (message.sender_id === recipientId && message.recipient_id === currentUserId) ||
          (message.sender_id === currentUserId && message.recipient_id === recipientId)
        ) {
          setMessages(prev => [...prev, {
            id: Date.now(), // Temporary ID for new messages
            sender: message.sender_id,
            recipient: message.recipient_id,
            content: message.message,
            timestamp: message.timestamp,
            read: false,
            sender_username: message.sender_username
          }]);
        }
      };
      
      const handleConnection = (isConnected: boolean) => {
        setConnected(isConnected);
        if (!isConnected) {
          setError('Disconnected from chat service. Reconnecting...');
        } else {
          setError(null);
        }
      };
      
      const handleError = (errorMsg: string) => {
        setError(errorMsg);
      };
      
      websocketService.subscribeToMessages(handleMessage);
      websocketService.subscribeToConnection(handleConnection);
      websocketService.subscribeToErrors(handleError);
      
      return () => {
        // Clean up subscriptions
        websocketService.unsubscribeFromMessages(handleMessage);
        websocketService.unsubscribeFromConnection(handleConnection);
        websocketService.unsubscribeFromErrors(handleError);
      };
    }
  }, [isOpen, recipientId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log('Loading messages for recipient:', recipientId);
      
      const data = await networkService.getMessages(recipientId);
      
      console.log('Messages loaded successfully:', {
        count: data.length,
        recipientId
      });

      setMessages(data);
      setError(null);
    } catch (error: unknown) {
      let errorString = '';
      try {
        errorString = JSON.stringify(error);
      } catch {
        errorString = String(error);
      }
      console.error('Error loading messages:', {
        error,
        errorString,
        recipientId,
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.stack : undefined
      });

      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else {
        errorMessage = 'Failed to load messages. Please try again.';
      }

      setError(errorMessage);

      // Handle authentication errors
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        (error as { status: number }).status === 401
      ) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      // Send message via WebSocket
      websocketService.sendMessage(recipientId, newMessage.trim());
      
      // Add message to local state immediately for better UX
      const tempMessage: Message = {
        id: Date.now(),
        sender: currentUserId,
        recipient: recipientId,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      // Also send via REST API as fallback
      await networkService.sendMessage(recipientId, newMessage.trim());
      
      console.log('Message sent successfully');
    } catch (error: unknown) {
      let errorMessage: string;
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to send message. Please try again.';
      }

      console.error('Error sending message:', {
        error,
        recipientId,
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.stack : undefined
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
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg mx-4">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Chat with {recipientName}</h2>
            <div className="ml-3">
              {connected ? (
                <FaWifi className="text-green-500" title="Connected" />
              ) : (
                <FiWifiOff className="text-red-500" title="Disconnected" />
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="h-96 overflow-y-auto p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={loadMessages}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          )}
          {messages.map((message) => (
                <div
                  key={`${message.id}-${message.timestamp}`}
                  className={`flex ${
                    message.sender === currentUserId ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === currentUserId
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || !connected}
            />
            <button
              type="submit"
              disabled={loading || !connected || !newMessage.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
