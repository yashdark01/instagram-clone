'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFeedAsync } from '@/store/thunks/postThunks';
import { selectFeedPosts, selectPostsLoading, selectPostsError, selectPostsPagination } from '@/store/selectors/postSelectors';
import PostCard from '@/components/PostCard';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectFeedPosts);
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);
  const pagination = useAppSelector(selectPostsPagination);

  useEffect(() => {
    dispatch(fetchFeedAsync({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
        !loading &&
        pagination.hasMore
      ) {
        dispatch(fetchFeedAsync({ page: pagination.page + 1, limit: 10 }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, pagination, dispatch]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0095f6]" />
          <p className="ig-text-secondary">Loading your feed...</p>
        </div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="ig-text-caption text-[#ed4956]">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="ig-text-large mb-2">No posts yet</h2>
        <p className="ig-text-secondary">
          Follow some users to see their posts in your feed!
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      
      {loading && posts.length > 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#0095f6]" />
        </div>
      )}
      
      {!pagination.hasMore && posts.length > 0 && (
        <div className="py-8 text-center">
          <p className="ig-text-secondary">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
