import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6),
  fullName: z.string().max(100).trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().toLowerCase().trim(),
  password: z.string().min(1),
});

export const createPostSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().max(2000).trim().optional(),
});

export const commentSchema = z.object({
  text: z.string().min(1).max(1000).trim(),
});

