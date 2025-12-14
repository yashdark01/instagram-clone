'use client';

import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onToggle: () => void;
}

export default function LikeButton({
  isLiked,
  likesCount,
  onToggle,
}: LikeButtonProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          "h-8 w-8 p-0 transition-all",
          isLiked && "text-[#ed4956]"
        )}
      >
        <Heart
          className={cn(
            "h-6 w-6 transition-all",
            isLiked && "fill-[#ed4956]"
          )}
        />
      </Button>
      {likesCount > 0 && (
        <span className="ig-text-username">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
      )}
    </div>
  );
}
