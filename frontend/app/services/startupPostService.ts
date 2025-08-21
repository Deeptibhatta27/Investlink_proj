import { getAuthToken } from '@/utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface StartupPost {
  id: string;
  content: string;
  likes?: number;
  liked?: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

class StartupPostService {
  handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      console.error('API Error:', error);
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  createPost = async (data: FormData): Promise<StartupPost> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    console.log('Creating post at:', `${API_URL}/startup-posts/`);
    try {
      const response = await fetch(`${API_URL}/startup-posts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  getPosts = async (page = 1): Promise<StartupPost[]> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    console.log('Fetching posts from:', `${API_URL}/startup-posts/`);
    try {
      const response = await fetch(
        `${API_URL}/startup-posts/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.message || 'Failed to fetch posts');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.results || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  };

  likePost = async (postId: string): Promise<void> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(
        `${API_URL}/startup-posts/${postId}/like/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      await this.handleResponse(response);
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  };

  addComment = async (postId: string, content: string): Promise<void> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(
        `${API_URL}/startup-posts/${postId}/add_comment/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      );
      await this.handleResponse(response);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  deletePost = async (postId: string): Promise<void> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(
        `${API_URL}/startup-posts/${postId}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  updatePost = async (postId: string, data: FormData): Promise<StartupPost> => {
    const token = getAuthToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(
        `${API_URL}/startup-posts/${postId}/`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: data,
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };
}

export const startupPostService = new StartupPostService();