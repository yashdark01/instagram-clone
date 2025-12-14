'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/selectors/authSelectors';

interface PostHeaderProps {
  userId: string;
  username: string;
  fullName?: string;
  postId?: string;
  onDelete?: () => void;
}

export default function PostHeader({ userId, username, fullName, postId, onDelete }: PostHeaderProps) {
  const user = useAppSelector(selectUser);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isOwnPost = user?.id === userId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Link href={`/profile/${userId}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-[#0095f6] text-white text-xs font-semibold">
            {username[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="ig-text-username">{username}</p>
        </div>
      </Link>
      {(isOwnPost || showMenu) && (
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal className="h-4 w-4 text-[#262626]" />
          </Button>
          {showMenu && isOwnPost && postId && onDelete && (
            <div className="absolute right-0 top-10 w-40 bg-white border border-[#dbdbdb] rounded-md shadow-lg py-1">
              <button
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[#fafafa] text-[#ed4956] flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
