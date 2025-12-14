import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { User } from '@/types';

const selectUsersState = (state: RootState) => state.users;

export const selectProfilesCache = createSelector([selectUsersState], (users) => users.profiles);
export const selectUserPostsCache = createSelector([selectUsersState], (users) => users.userPosts);
export const selectSuggestions = createSelector([selectUsersState], (users) => users.suggestions);
export const selectUsersLoading = createSelector([selectUsersState], (users) => users.loading);
export const selectUsersError = createSelector([selectUsersState], (users) => users.error);

// Select profile by ID
export const selectProfileById = createSelector(
  [selectProfilesCache, (state: RootState, userId: string) => userId],
  (profilesCache, userId) => profilesCache[userId]
);

// Select user posts by user ID
export const selectUserPostIds = createSelector(
  [selectUserPostsCache, (state: RootState, userId: string) => userId],
  (userPostsCache, userId) => userPostsCache[userId] || []
);

