'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfileAsync, fetchUserPostsAsync } from '@/store/thunks/userThunks';
import { selectProfileById, selectUsersLoading, selectUsersError, selectUserPostIds } from '@/store/selectors/userSelectors';
import { selectPostsCache, selectPostById } from '@/store/selectors/postSelectors';
import { selectUser } from '@/store/selectors/authSelectors';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import FollowButton from '@/components/FollowButton';
import { getImageUrl } from '@/lib/imageUtils';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const profile = useAppSelector((state) => selectProfileById(state, userId));
  const userPostIds = useAppSelector((state) => selectUserPostIds(state, userId));
  const postsCache = useAppSelector(selectPostsCache);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfileAsync(userId));
      dispatch(fetchUserPostsAsync({ userId, page: 1, limit: 100 }));
    }
  }, [userId, dispatch]);

  // Get posts from cache
  const posts: Post[] = userPostIds
    .map((postId) => postsCache[postId])
    .filter((post): post is Post => post !== undefined);

  if (loading && !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0095f6]" />
          <p className="ig-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="py-12 text-center">
        <p className="ig-text-caption text-[#ed4956]">{error || 'Profile not found'}</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  const handleFollowToggle = () => {
    // Refetch profile to update follow status
    dispatch(fetchProfileAsync(userId));
  };

  return (
    <div className="py-8">
      {/* Profile Header */}
      <div className="mb-12 px-4">
        <div className="flex flex-col gap-6 md:flex-row md:gap-12">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <Avatar className="h-[150px] w-[150px]">
              <AvatarFallback className="bg-[#0095f6] text-white text-5xl font-light">
                {profile.username[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <h1 className="ig-text-large text-center md:text-left">{profile.username}</h1>
              {isOwnProfile ? (
                <Button className="ig-text-link border border-[#dbdbdb] rounded-md px-4 py-1.5 h-8">
                  Edit Profile
                </Button>
              ) : (
                <FollowButton
                  userId={userId}
                  isFollowing={profile.isFollowing || false}
                  onToggle={handleFollowToggle}
                />
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 justify-center md:justify-start">
              <div>
                <span className="ig-text-username">{posts.length}</span>
                <span className="ig-text-secondary ml-1">posts</span>
              </div>
              <div>
                <span className="ig-text-username">{profile.followersCount || 0}</span>
                <span className="ig-text-secondary ml-1">followers</span>
              </div>
              <div>
                <span className="ig-text-username">{profile.followingCount || 0}</span>
                <span className="ig-text-secondary ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            {profile.fullName && (
              <div>
                <p className="ig-text-username">{profile.fullName}</p>
              </div>
            )}
            {profile.bio && (
              <div>
                <p className="ig-text-caption">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="border-t border-[#dbdbdb]">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full border-2 border-[#262626] flex items-center justify-center">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="ig-text-large">No Posts Yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-px">
            {posts.map((post) => {
              const imageUrl = getImageUrl(post.imageUrl);
              return (
                <Link
                  key={post._id}
                  href={`/post/${post._id}`}
                  className="group relative aspect-square overflow-hidden bg-black"
                >
                  <img
                    src={imageUrl}
                    alt={post.caption || 'Post'}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                    <div className="flex items-center gap-1">
                      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="font-semibold">{post.likesCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                        <path d="M21.99 4c0-1.1-.89-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                      </svg>
                      <span className="font-semibold">{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
