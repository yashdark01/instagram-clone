import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  signup: async (data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async (userId: string) => {
    if (!userId || userId === 'undefined') {
      throw new Error('Invalid user ID');
    }
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },
  getUserPosts: async (userId: string, page = 1, limit = 10) => {
    if (!userId || userId === 'undefined') {
      throw new Error('Invalid user ID');
    }
    const response = await api.get(`/api/users/${userId}/posts`, {
      params: { page, limit },
    });
    return response.data;
  },
  follow: async (userId: string) => {
    if (!userId || userId === 'undefined') {
      throw new Error('Invalid user ID');
    }
    const response = await api.post(`/api/users/${userId}/follow`);
    return response.data;
  },
  unfollow: async (userId: string) => {
    if (!userId || userId === 'undefined') {
      throw new Error('Invalid user ID');
    }
    const response = await api.delete(`/api/users/${userId}/follow`);
    return response.data;
  },
  getFollowers: async (userId: string) => {
    if (!userId || userId === 'undefined') {
      throw new Error('Invalid user ID');
    }
    const response = await api.get(`/api/users/${userId}/followers`);
    return response.data;
  },
  getFollowing: async (userId: string) => {
    if (!userId || userId === 'undefined') {
      throw new Error('Invalid user ID');
    }
    const response = await api.get(`/api/users/${userId}/following`);
    return response.data;
  },
  searchUsers: async (query: string) => {
    if (!query || query.trim() === '') {
      return { users: [] };
    }
    const response = await api.get('/api/users/search', {
      params: { q: query },
    });
    return response.data;
  },
};

// Post API
export const postAPI = {
  create: async (imageUrl: string, caption?: string) => {
    const response = await api.post('/api/posts', { imageUrl, caption });
    return response.data;
  },
  getPost: async (postId: string) => {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data;
  },
  delete: async (postId: string) => {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  },
  like: async (postId: string) => {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
  },
  unlike: async (postId: string) => {
    const response = await api.delete(`/api/posts/${postId}/like`);
    return response.data;
  },
  getLikes: async (postId: string) => {
    const response = await api.get(`/api/posts/${postId}/likes`);
    return response.data;
  },
  addComment: async (postId: string, text: string) => {
    const response = await api.post(`/api/posts/${postId}/comments`, { text });
    return response.data;
  },
  getComments: async (postId: string, page = 1, limit = 50) => {
    const response = await api.get(`/api/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },
  deleteComment: async (postId: string, commentId: string) => {
    const response = await api.delete(
      `/api/posts/${postId}/comments/${commentId}`
    );
    return response.data;
  },
};

// Feed API
export const feedAPI = {
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get('/api/feed', {
      params: { page, limit },
    });
    return response.data;
  },
};

export default api;

