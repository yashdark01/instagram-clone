'use client';

import { useState } from 'react';
import { Comment } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCommentAsync, deleteCommentAsync } from '@/store/thunks/postThunks';
import { selectUser } from '@/store/selectors/authSelectors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || loading) return;

    setLoading(true);
    try {
      await dispatch(addCommentAsync({ postId, text: commentText }));
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await dispatch(deleteCommentAsync({ postId, commentId }));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="px-4">
      {initialComments.length > 0 && (
        <div className="max-h-[400px] space-y-1 overflow-y-auto py-2">
          {initialComments.map((comment) => {
            const commentUserId = typeof comment.userId === 'string' ? comment.userId : comment.userId.id;
            const commentUsername = typeof comment.userId === 'string' ? 'Unknown' : comment.userId.username || 'Unknown';
            const canDelete = user && (user.id === commentUserId);

            return (
              <div key={comment._id} className="flex items-start gap-3 group py-1">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-[#0095f6] text-white text-xs font-semibold">
                    {commentUsername[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="ig-text-caption">
                        <span className="ig-text-username">{commentUsername}</span>{' '}
                        {comment.text}
                      </p>
                      <p className="ig-text-secondary mt-1">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(comment._id)}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-[#8e8e8e] hover:text-[#ed4956]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#dbdbdb] pt-3 pb-1">
        <Input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 ig-text-caption placeholder:text-[#8e8e8e]"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={!commentText.trim() || loading}
          className="h-auto p-0 ig-text-link font-semibold"
        >
          Post
        </Button>
      </form>
    </div>
  );
}
