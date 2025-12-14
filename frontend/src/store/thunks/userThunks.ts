import { createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '@/lib/api';
import { User, Post } from '@/types';

export const fetchProfileAsync = createAsyncThunk(
  'users/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userAPI.getProfile(userId);
      return response.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
    }
  }
);

export const fetchUserPostsAsync = createAsyncThunk(
  'users/fetchUserPosts',
  async ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUserPosts(userId, page, limit);
      return {
        userId,
        posts: response.posts as Post[],
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user posts');
    }
  }
);

export const followUserAsync = createAsyncThunk(
  'users/followUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await userAPI.follow(userId);
      const response = await userAPI.getProfile(userId);
      return response.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to follow user');
    }
  }
);

export const unfollowUserAsync = createAsyncThunk(
  'users/unfollowUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await userAPI.unfollow(userId);
      const response = await userAPI.getProfile(userId);
      return response.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to unfollow user');
    }
  }
);

export const searchUsersAsync = createAsyncThunk(
  'users/searchUsers',
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === '') {
        return [];
      }
      const response = await userAPI.searchUsers(query);
      return response.users as User[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to search users');
    }
  }
);

export const fetchSuggestionsAsync = createAsyncThunk(
  'users/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement suggestions API endpoint
      // For now, return empty array
      return [] as User[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch suggestions');
    }
  }
);

