'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser, selectAuthLoading } from '@/store/selectors/authSelectors';
import { selectSuggestions } from '@/store/selectors/userSelectors';
import { fetchSuggestionsAsync } from '@/store/thunks/userThunks';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import FollowButton from '@/components/FollowButton';
import Link from 'next/link';

export default function RightSidebar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const suggestions = useAppSelector(selectSuggestions);
  
  // Get user ID - handle both id and _id for compatibility
  const userId = user?.id || (user as any)?._id;

  useEffect(() => {
    dispatch(fetchSuggestionsAsync());
  }, [dispatch]);

  return (
    <aside className="hidden xl:block w-[293px]">
      <div className="sticky top-[74px] space-y-4">
        {/* Current User Summary */}
        {!loading && user && userId && (
          <div className="flex items-center gap-3 px-4 py-2">
            <Link href={`/profile/${userId}`}>
              <Avatar className="h-14 w-14 cursor-pointer">
                <AvatarFallback className="bg-[#0095f6] text-white text-lg">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/profile/${userId}`}>
                <p className="ig-text-username truncate">{user.username}</p>
              </Link>
              {user.fullName && (
                <p className="ig-text-secondary truncate">{user.fullName}</p>
              )}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <p className="ig-text-secondary font-semibold">Suggestions for you</p>
            <Button variant="ghost" className="h-auto p-0 text-xs font-semibold text-[#262626]">
              See All
            </Button>
          </div>
          
          {suggestions.length === 0 && (
            <p className="ig-text-secondary text-sm py-4">No suggestions available</p>
          )}
          
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center gap-3 py-2">
              <Link href={`/profile/${suggestion.id}`}>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarFallback className="bg-[#0095f6] text-white text-sm">
                    {suggestion.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${suggestion.id}`}>
                  <p className="ig-text-username truncate">{suggestion.username}</p>
                </Link>
                {suggestion.fullName && (
                  <p className="ig-text-secondary truncate text-xs">{suggestion.fullName}</p>
                )}
              </div>
              <FollowButton
                userId={suggestion.id}
                isFollowing={false}
                onToggle={() => {}}
              />
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="px-4 pt-4">
          <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
            {['About', 'Help', 'Press', 'API', 'Jobs', 'Privacy', 'Terms', 'Locations', 'Language'].map((link) => (
              <a
                key={link}
                href="#"
                className="ig-text-secondary text-xs hover:underline"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="ig-text-secondary text-xs">© 2024 Instagram Clone</p>
        </div>
      </div>
    </aside>
  );
}

