import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/lib/api';
import { User } from '@/types';

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      return response.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check authentication');
    }
  }
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      return response.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const signupAsync = createAsyncThunk(
  'auth/signup',
  async (
    { username, email, password, fullName }: { username: string; email: string; password: string; fullName?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.signup({ username, email, password, fullName });
      return response.user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Signup failed');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Logout failed');
    }
  }
);

