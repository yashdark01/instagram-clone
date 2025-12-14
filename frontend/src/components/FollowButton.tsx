'use client';

import { useAppDispatch } from '@/store/hooks';
import { followUserAsync, unfollowUserAsync } from '@/store/thunks/userThunks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onToggle?: () => void;
}

export default function FollowButton({
  userId,
  isFollowing,
  onToggle,
}: FollowButtonProps) {
  const dispatch = useAppDispatch();

  const handleToggle = async () => {
    if (isFollowing) {
      await dispatch(unfollowUserAsync(userId));
    } else {
      await dispatch(followUserAsync(userId));
    }
    onToggle?.();
  };

  return (
    <Button
      onClick={handleToggle}
      className={cn(
        "h-8 px-4 rounded-md font-semibold text-sm",
        isFollowing
          ? "bg-white border border-[#dbdbdb] text-[#262626] hover:bg-[#fafafa]"
          : "bg-[#0095f6] hover:bg-[#1877f2] text-white"
      )}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
