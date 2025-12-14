'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPostAsync, likePostAsync, unlikePostAsync } from '@/store/thunks/postThunks';
import { selectPostById, selectPostsLoading, selectPostsError } from '@/store/selectors/postSelectors';
import PostActions from '@/components/post/PostActions';
import CommentSection from '@/components/CommentSection';
import { getImageUrl } from '@/lib/imageUtils';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;
  const dispatch = useAppDispatch();
  const post = useAppSelector((state) => selectPostById(state, postId));
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);

  useEffect(() => {
    if (postId && !post) {
      dispatch(fetchPostAsync(postId));
    }
  }, [postId, post, dispatch]);

  const handleLikeToggle = async () => {
    if (!post) return;
    
    if (post.isLiked) {
      dispatch(unlikePostAsync(postId));
    } else {
      dispatch(likePostAsync(postId));
    }
  };

  if (loading && !post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0095f6]" />
          <p className="ig-text-secondary">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-12 text-center">
        <p className="ig-text-caption text-[#ed4956]">{error || 'Post not found'}</p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-4 border-[#dbdbdb]"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const userId = typeof post.userId === 'string' ? post.userId : post.userId.id;
  const username = typeof post.userId === 'string' ? 'Unknown' : post.userId.username || 'Unknown';
  const imageUrl = getImageUrl(post.imageUrl);

  return (
    <div className="mx-auto max-w-[614px] px-4 py-4">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 text-[#262626] hover:bg-[#fafafa]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      
      <article className="bg-white border border-[#dbdbdb]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#dbdbdb]">
          <Link href={`/profile/${userId}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#0095f6] text-white text-sm font-semibold">
                {username[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <p className="ig-text-username">{username}</p>
          </Link>
        </div>
        
        {/* Image */}
        <div className="aspect-square w-full overflow-hidden bg-black">
          <img
            src={imageUrl}
            alt={post.caption || 'Post'}
            className="h-full w-full object-contain"
          />
        </div>
        
        {/* Actions & Content */}
        <div className="space-y-2">
          <PostActions
            isLiked={post.isLiked || false}
            likesCount={post.likesCount || 0}
            postId={postId}
            onLikeToggle={handleLikeToggle}
          />
          
          {post.caption && (
            <div className="px-4">
              <p className="ig-text-caption">
                <Link href={`/profile/${userId}`} className="ig-text-username hover:opacity-70">
                  {username}
                </Link>{' '}
                <span>{post.caption}</span>
              </p>
            </div>
          )}
          
          <CommentSection
            postId={postId}
            comments={post.comments || []}
          />
        </div>
      </article>
    </div>
  );
}
