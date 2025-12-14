'use client';

import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PostActionsProps {
  isLiked: boolean;
  likesCount: number;
  postId: string;
  onLikeToggle: () => void;
}

export default function PostActions({ isLiked, likesCount, postId, onLikeToggle }: PostActionsProps) {
  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onLikeToggle}
            className={cn(
              "h-8 w-8 p-0",
              isLiked && "text-[#ed4956]"
            )}
          >
            <Heart
              className={cn(
                "h-6 w-6",
                isLiked && "fill-[#ed4956]"
              )}
            />
          </Button>
          <Link href={`/post/${postId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MessageCircle className="h-6 w-6" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Send className="h-6 w-6" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Bookmark className="h-6 w-6" />
        </Button>
      </div>
      {likesCount > 0 && (
        <div className="mb-1">
          <p className="ig-text-username">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</p>
        </div>
      )}
    </div>
  );
}

