'use client';

import * as React from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  onRemove?: () => void;
  className?: string;
  maxSize?: number;
  accept?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = 'image/*',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFile = async (file: File) => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      onChange(base64);
    };
    reader.onerror = () => {
      alert('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (preview) {
    return (
      <div className={cn('relative group', className)}>
        <div className="relative aspect-square w-full overflow-hidden border border-[#dbdbdb] bg-white">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="h-10 w-10 bg-[#ed4956] hover:bg-[#ed4956]/90"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed border-[#dbdbdb] bg-white transition-colors',
        isDragging && 'border-[#0095f6] bg-[#fafafa]',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 rounded-full bg-[#fafafa] p-4">
          <ImageIcon className="h-8 w-8 text-[#8e8e8e]" />
        </div>
        <p className="mb-2 ig-text-username">
          Drag and drop an image, or click to select
        </p>
        <p className="mb-4 ig-text-secondary">
          PNG, JPG, GIF up to {maxSize / 1024 / 1024}MB
        </p>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleClick}
          className="border-[#dbdbdb] hover:bg-[#fafafa]"
        >
          <Upload className="mr-2 h-4 w-4" />
          Select Image
        </Button>
      </div>
    </div>
  );
}

