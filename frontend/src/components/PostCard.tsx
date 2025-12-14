'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { likePostAsync, unlikePostAsync, deletePostAsync } from '@/store/thunks/postThunks';
import { selectUser } from '@/store/selectors/authSelectors';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/imageUtils';
import PostHeader from './post/PostHeader';
import PostActions from './post/PostActions';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const router = useRouter();

  const handleLikeToggle = async () => {
    if (post.isLiked) {
      dispatch(unlikePostAsync(post._id));
    } else {
      dispatch(likePostAsync(post._id));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await dispatch(deletePostAsync(post._id));
      router.push('/home');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const userId = typeof post.userId === 'string' ? post.userId : post.userId.id;
  const username = typeof post.userId === 'string' ? 'Unknown' : post.userId.username || 'Unknown';
  const imageUrl = getImageUrl(post.imageUrl);

  return (
    <article className="mb-8 max-w-[614px] mx-auto bg-white border border-[#dbdbdb]">
      {/* Header */}
      <PostHeader userId={userId} username={username} postId={post._id} onDelete={handleDelete} />

      {/* Image */}
      <div className="aspect-square w-full overflow-hidden bg-black">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={post.caption || 'Post'}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#fafafa]">
            <p className="ig-text-secondary">Failed to load image</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <PostActions
        isLiked={post.isLiked || false}
        likesCount={post.likesCount || 0}
        postId={post._id}
        onLikeToggle={handleLikeToggle}
      />

      {/* Caption */}
      {post.caption && (
        <div className="px-4 mb-1">
          <p className="ig-text-caption">
            <Link href={`/profile/${userId}`} className="ig-text-username hover:opacity-70">
              {username}
            </Link>{' '}
            <span>{post.caption}</span>
          </p>
        </div>
      )}

      {/* Comments Preview */}
      {post.comments && post.comments.length > 0 && (
        <div className="px-4 mb-1">
          <Link
            href={`/post/${post._id}`}
            className="ig-text-secondary hover:text-[#8e8e8e]"
          >
            View all {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
          </Link>
        </div>
      )}

      {/* Time */}
      <div className="px-4 pb-3">
        <p className="ig-text-secondary uppercase">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </div>
    </article>
  );
}
