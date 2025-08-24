// services/websocketService.ts
// WebSocket service for real-time chat functionality

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: ((message: any) => void)[] = [];
  private connectionCallbacks: ((connected: boolean) => void)[] = [];
  private errorCallbacks: ((error: string) => void)[] = [];
  private userId: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  connect(userId: number, token: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    this.userId = userId;
    
    // Close existing connection if any
    if (this.socket) {
      this.socket.close();
    }

    // Determine WebSocket URL based on current protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/chat/${userId}/?token=${token}`;

    try {
      // Use the same protocol and host as the API
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const url = new URL(apiBaseUrl);
      const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = url.host;
      const wsUrl = `${protocol}//${host}/ws/chat/${userId}/?token=${token}`;
      
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.notifyConnection(true);
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.notifyMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
        this.notifyConnection(false);
        
        // Attempt to reconnect if not closed intentionally
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnect(token);
          }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyError('WebSocket connection error');
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.notifyError('Failed to establish WebSocket connection');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(recipientId: number, message: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      this.notifyError('Not connected to chat service');
      return;
    }

    const messageData = {
      recipient_id: recipientId,
      message: message
    };

    try {
      this.socket.send(JSON.stringify(messageData));
    } catch (error) {
      console.error('Error sending message:', error);
      this.notifyError('Failed to send message');
    }
  }

  subscribeToMessages(callback: (message: any) => void) {
    this.messageCallbacks.push(callback);
  }

  unsubscribeFromMessages(callback: (message: any) => void) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  subscribeToConnection(callback: (connected: boolean) => void) {
    this.connectionCallbacks.push(callback);
  }

  unsubscribeFromConnection(callback: (connected: boolean) => void) {
    this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
  }

  subscribeToErrors(callback: (error: string) => void) {
    this.errorCallbacks.push(callback);
  }

  unsubscribeFromErrors(callback: (error: string) => void) {
    this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
  }

  private notifyMessage(message: any) {
    this.messageCallbacks.forEach(callback => callback(message));
  }

  private notifyConnection(connected: boolean) {
    this.connectionCallbacks.forEach(callback => callback(connected));
  }

  private notifyError(error: string) {
    this.errorCallbacks.forEach(callback => callback(error));
  }

  private reconnect(token: string) {
    if (this.userId) {
      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts}`);
      this.connect(this.userId, token);
    }
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();