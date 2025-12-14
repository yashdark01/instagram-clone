'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { createPostAsync } from '@/store/thunks/postThunks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { Loader2 } from 'lucide-react';

export default function CreatePostPage() {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleImageChange = async (base64: string) => {
    setImageBase64(base64);
    setError('');
  };

  const handleImageRemove = () => {
    setImageBase64('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!imageBase64) {
      setError('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const result = await dispatch(createPostAsync({ imageUrl: imageBase64, caption }));
      if (createPostAsync.fulfilled.match(result)) {
        router.push('/home');
      } else {
        setError('Failed to create post. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[614px] px-4 py-8">
      <div className="mb-6">
        <h1 className="ig-text-large">Create New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <ImageUpload
            value={imageBase64}
            onChange={handleImageChange}
            onRemove={handleImageRemove}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            maxLength={2000}
            className="resize-none border-[#dbdbdb] bg-white text-sm"
          />
          <div className="flex justify-end">
            <span className="ig-text-secondary text-xs">{caption.length}/2000</span>
          </div>
        </div>

        {error && (
          <div className="rounded-sm bg-red-50 p-3 text-sm text-[#ed4956] border border-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-[#dbdbdb]"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#0095f6] hover:bg-[#1877f2] text-white"
            disabled={loading || !imageBase64}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              'Share'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
