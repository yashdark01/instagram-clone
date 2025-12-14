import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, Comment } from '@/types';
import {
  fetchFeedAsync,
  fetchPostAsync,
  createPostAsync,
  deletePostAsync,
  likePostAsync,
  unlikePostAsync,
  addCommentAsync,
  deleteCommentAsync,
} from '../thunks/postThunks';
import { fetchUserPostsAsync } from '../thunks/userThunks';

interface PostsState {
  posts: Record<string, Post>; // Cache of posts by ID
  feedPosts: string[]; // Array of post IDs in feed
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    hasMore: boolean;
    totalPosts: number;
  };
}

const initialState: PostsState = {
  posts: {},
  feedPosts: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    hasMore: true,
    totalPosts: 0,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updatePostInCache: (state, action: PayloadAction<Post>) => {
      const post = action.payload;
      state.posts[post._id] = post;
    },
    removePostFromCache: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      delete state.posts[postId];
      state.feedPosts = state.feedPosts.filter((id) => id !== postId);
    },
    clearFeed: (state) => {
      state.feedPosts = [];
      state.pagination = {
        page: 1,
        hasMore: true,
        totalPosts: 0,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Feed
    builder
      .addCase(fetchFeedAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { posts, pagination } = action.payload;
        
        // Cache posts
        posts.forEach((post: Post) => {
          state.posts[post._id] = post;
        });

        // Update feed posts
        if (pagination.page === 1) {
          state.feedPosts = posts.map((post: Post) => post._id);
        } else {
          const newPostIds = posts.map((post: Post) => post._id);
          state.feedPosts = [...state.feedPosts, ...newPostIds];
        }

        state.pagination = {
          page: pagination.page,
          hasMore: pagination.page < pagination.totalPages,
          totalPosts: pagination.totalPosts,
        };
      })
      .addCase(fetchFeedAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load feed';
      });

    // Fetch Post
    builder
      .addCase(fetchPostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        const post = action.payload;
        state.posts[post._id] = post;
      })
      .addCase(fetchPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load post';
      });

    // Create Post
    builder
      .addCase(createPostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        const post = action.payload;
        state.posts[post._id] = post;
        // Add to beginning of feed
        state.feedPosts = [post._id, ...state.feedPosts];
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create post';
      });

    // Delete Post
    builder
      .addCase(deletePostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.loading = false;
        const postId = action.payload;
        delete state.posts[postId];
        state.feedPosts = state.feedPosts.filter((id) => id !== postId);
      })
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete post';
      });

    // Like Post (Optimistic)
    builder
      .addCase(likePostAsync.pending, (state, action) => {
        const postId = action.meta.arg;
        const post = state.posts[postId];
        if (post) {
          post.isLiked = true;
          post.likesCount = (post.likesCount || 0) + 1;
        }
      })
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const post = action.payload;
        state.posts[post._id] = post;
      })
      .addCase(likePostAsync.rejected, (state, action) => {
        // Rollback optimistic update
        const postId = action.meta.arg;
        const post = state.posts[postId];
        if (post) {
          post.isLiked = false;
          post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
        }
        state.error = action.error.message || 'Failed to like post';
      });

    // Unlike Post (Optimistic)
    builder
      .addCase(unlikePostAsync.pending, (state, action) => {
        const postId = action.meta.arg;
        const post = state.posts[postId];
        if (post) {
          post.isLiked = false;
          post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
        }
      })
      .addCase(unlikePostAsync.fulfilled, (state, action) => {
        const post = action.payload;
        state.posts[post._id] = post;
      })
      .addCase(unlikePostAsync.rejected, (state, action) => {
        // Rollback optimistic update
        const postId = action.meta.arg;
        const post = state.posts[postId];
        if (post) {
          post.isLiked = true;
          post.likesCount = (post.likesCount || 0) + 1;
        }
        state.error = action.error.message || 'Failed to unlike post';
      });

    // Add Comment
    builder
      .addCase(addCommentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, comment } = action.payload;
        const post = state.posts[postId];
        if (post) {
          if (!post.comments) {
            post.comments = [];
          }
          post.comments = [comment, ...post.comments];
        }
      })
      .addCase(addCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add comment';
      });

    // Delete Comment
    builder
      .addCase(deleteCommentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, commentId } = action.payload;
        const post = state.posts[postId];
        if (post && post.comments) {
          post.comments = post.comments.filter((c: Comment) => c._id !== commentId);
        }
      })
      .addCase(deleteCommentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete comment';
      });

    // Fetch User Posts - Cache posts when user posts are fetched
    builder.addCase(fetchUserPostsAsync.fulfilled, (state, action) => {
      const { posts } = action.payload;
      // Cache all posts in the posts slice
      posts.forEach((post: Post) => {
        state.posts[post._id] = post;
      });
    });
  },
});

export const { updatePostInCache, removePostFromCache, clearFeed } = postsSlice.actions;
export default postsSlice.reducer;

