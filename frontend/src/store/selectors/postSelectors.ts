import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Post } from '@/types';

const selectPostsState = (state: RootState) => state.posts;

export const selectPostsCache = createSelector([selectPostsState], (posts) => posts.posts);
export const selectFeedPostIds = createSelector([selectPostsState], (posts) => posts.feedPosts);
export const selectPostsLoading = createSelector([selectPostsState], (posts) => posts.loading);
export const selectPostsError = createSelector([selectPostsState], (posts) => posts.error);
export const selectPostsPagination = createSelector([selectPostsState], (posts) => posts.pagination);

// Select feed posts as array
export const selectFeedPosts = createSelector(
  [selectPostsCache, selectFeedPostIds],
  (postsCache, feedPostIds) => {
    return feedPostIds
      .map((id) => postsCache[id])
      .filter((post): post is Post => post !== undefined);
  }
);

// Select post by ID
export const selectPostById = createSelector(
  [selectPostsCache, (state: RootState, postId: string) => postId],
  (postsCache, postId) => postsCache[postId]
);

