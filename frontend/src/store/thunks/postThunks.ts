import { createAsyncThunk } from '@reduxjs/toolkit';
import { postAPI, feedAPI } from '@/lib/api';
import { Post, Comment } from '@/types';

export const fetchFeedAsync = createAsyncThunk(
  'posts/fetchFeed',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await feedAPI.getFeed(page, limit);
      return {
        posts: response.posts as Post[],
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch feed');
    }
  }
);

export const fetchPostAsync = createAsyncThunk(
  'posts/fetchPost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await postAPI.getPost(postId);
      return response.post as Post;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch post');
    }
  }
);

export const createPostAsync = createAsyncThunk(
  'posts/createPost',
  async ({ imageUrl, caption }: { imageUrl: string; caption?: string }, { rejectWithValue }) => {
    try {
      const response = await postAPI.create(imageUrl, caption);
      return response.post as Post;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create post');
    }
  }
);

export const deletePostAsync = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postAPI.delete(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete post');
    }
  }
);

export const likePostAsync = createAsyncThunk(
  'posts/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postAPI.like(postId);
      const response = await postAPI.getPost(postId);
      return response.post as Post;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to like post');
    }
  }
);

export const unlikePostAsync = createAsyncThunk(
  'posts/unlikePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postAPI.unlike(postId);
      const response = await postAPI.getPost(postId);
      return response.post as Post;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to unlike post');
    }
  }
);

export const addCommentAsync = createAsyncThunk(
  'posts/addComment',
  async ({ postId, text }: { postId: string; text: string }, { rejectWithValue }) => {
    try {
      const response = await postAPI.addComment(postId, text);
      return {
        postId,
        comment: response.comment as Comment,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add comment');
    }
  }
);

export const deleteCommentAsync = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }: { postId: string; commentId: string }, { rejectWithValue }) => {
    try {
      await postAPI.deleteComment(postId, commentId);
      return { postId, commentId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete comment');
    }
  }
);

