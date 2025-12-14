import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import {
  fetchProfileAsync,
  fetchUserPostsAsync,
  followUserAsync,
  unfollowUserAsync,
  searchUsersAsync,
  fetchSuggestionsAsync,
} from '../thunks/userThunks';

interface UsersState {
  profiles: Record<string, User>; // Cache of user profiles by ID
  userPosts: Record<string, string[]>; // Post IDs by user ID
  suggestions: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  profiles: {},
  userPosts: {},
  suggestions: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserPosts: (state, action: PayloadAction<string>) => {
      delete state.userPosts[action.payload];
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        state.profiles[user.id] = user;
      })
      .addCase(fetchProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });

    // Fetch User Posts
    builder
      .addCase(fetchUserPostsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPostsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, posts } = action.payload;
        state.userPosts[userId] = posts.map((post: any) => post._id);
      })
      .addCase(fetchUserPostsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user posts';
      });

    // Follow User (Optimistic)
    builder
      .addCase(followUserAsync.pending, (state, action) => {
        const userId = action.meta.arg;
        const profile = state.profiles[userId];
        if (profile) {
          profile.isFollowing = true;
          profile.followersCount = (profile.followersCount || 0) + 1;
        }
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        const user = action.payload;
        state.profiles[user.id] = user;
      })
      .addCase(followUserAsync.rejected, (state, action) => {
        // Rollback optimistic update
        const userId = action.meta.arg;
        const profile = state.profiles[userId];
        if (profile) {
          profile.isFollowing = false;
          profile.followersCount = Math.max(0, (profile.followersCount || 0) - 1);
        }
        state.error = action.error.message || 'Failed to follow user';
      });

    // Unfollow User (Optimistic)
    builder
      .addCase(unfollowUserAsync.pending, (state, action) => {
        const userId = action.meta.arg;
        const profile = state.profiles[userId];
        if (profile) {
          profile.isFollowing = false;
          profile.followersCount = Math.max(0, (profile.followersCount || 0) - 1);
        }
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        const user = action.payload;
        state.profiles[user.id] = user;
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        // Rollback optimistic update
        const userId = action.meta.arg;
        const profile = state.profiles[userId];
        if (profile) {
          profile.isFollowing = true;
          profile.followersCount = (profile.followersCount || 0) + 1;
        }
        state.error = action.error.message || 'Failed to unfollow user';
      });

    // Search Users
    builder
      .addCase(searchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        const users = action.payload;
        // Cache searched users
        users.forEach((user: User) => {
          state.profiles[user.id] = user;
        });
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search users';
      });

    // Fetch Suggestions
    builder
      .addCase(fetchSuggestionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
        // Cache suggested users
        action.payload.forEach((user: User) => {
          state.profiles[user.id] = user;
        });
      })
      .addCase(fetchSuggestionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch suggestions';
      });
  },
});

export const { clearUserPosts, clearSuggestions } = usersSlice.actions;
export default usersSlice.reducer;

