'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { searchUsersAsync } from '@/store/thunks/userThunks';
import { selectSearchQuery } from '@/store/selectors/uiSelectors';
import { setSearchQuery, setSearchResults } from '@/store/slices/uiSlice';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectSearchQuery);
  const users = useAppSelector((state) => state.ui.searchResults);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(setSearchResults([]));
      return;
    }

    const debounce = setTimeout(async () => {
      const result = await dispatch(searchUsersAsync(query));
      if (searchUsersAsync.fulfilled.match(result)) {
        dispatch(setSearchResults(result.payload));
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-[#dbdbdb]">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-[#8e8e8e]" />
            <Input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {users.length === 0 && query && (
            <div className="p-4 text-center">
              <p className="ig-text-secondary">No users found</p>
            </div>
          )}
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              onClick={onClose}
              className="flex items-center gap-3 p-4 hover:bg-[#fafafa] border-b border-[#dbdbdb]"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-[#0095f6] text-white">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="ig-text-username">{user.username}</p>
                {user.fullName && (
                  <p className="ig-text-secondary text-sm">{user.fullName}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

