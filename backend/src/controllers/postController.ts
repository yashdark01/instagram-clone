import { Response } from 'express';
import mongoose from 'mongoose';
import { Post } from '../models/Post';
import { Like } from '../models/Like';
import { Comment } from '../models/Comment';
import { AuthRequest } from '../middleware/auth';
import { createPostSchema, commentSchema } from '../utils/validation';

export const createPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    const { imageUrl, caption } = validatedData;

    const post = new Post({
      userId: req.userId!,
      imageUrl,
      caption,
    });

    await post.save();
    await post.populate('userId', 'username fullName profilePicture');

    const postObj = post.toObject();
    // Transform userId to have 'id' instead of '_id' for frontend compatibility
    if (postObj.userId && typeof postObj.userId === 'object' && postObj.userId._id) {
      postObj.userId = {
        ...postObj.userId,
        id: postObj.userId._id.toString(),
      };
      delete postObj.userId._id;
    }

    res.status(201).json({ post: postObj });
  } catch (error) {
    throw error;
  }
};

export const getPost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    const post = await Post.findById(postId).populate(
      'userId',
      'username fullName profilePicture'
    );

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const likesCount = await Like.countDocuments({ postId });
    const isLiked = req.userId
      ? !!(await Like.findOne({ userId: req.userId, postId }))
      : false;

    const comments = await Comment.find({ postId })
      .populate('userId', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);

    const postObj = post.toObject();
    // Transform userId to have 'id' instead of '_id' for frontend compatibility
    if (postObj.userId && typeof postObj.userId === 'object' && postObj.userId._id) {
      postObj.userId = {
        ...postObj.userId,
        id: postObj.userId._id.toString(),
      };
      delete postObj.userId._id;
    }

    // Transform comments userId similarly
    const transformedComments = comments.map((comment) => {
      const commentObj = comment.toObject();
      if (commentObj.userId && typeof commentObj.userId === 'object' && commentObj.userId._id) {
        commentObj.userId = {
          ...commentObj.userId,
          id: commentObj.userId._id.toString(),
        };
        delete commentObj.userId._id;
      }
      return commentObj;
    });

    res.json({
      post: {
        ...postObj,
        likesCount,
        isLiked,
        comments: transformedComments,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.userId.toString() !== req.userId) {
      res.status(403).json({ error: 'Not authorized to delete this post' });
      return;
    }

    await Post.findByIdAndDelete(postId);
    await Like.deleteMany({ postId });
    await Comment.deleteMany({ postId });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    throw error;
  }
};

export const likePost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      res.status(400).json({ error: 'Post already liked' });
      return;
    }

    const like = new Like({ userId, postId });
    await like.save();

    res.json({ message: 'Post liked successfully' });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Post already liked' });
      return;
    }
    throw error;
  }
};

export const unlikePost = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = req.userId!;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    const like = await Like.findOneAndDelete({ userId, postId });

    if (!like) {
      res.status(404).json({ error: 'Post not liked' });
      return;
    }

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    throw error;
  }
};

export const getPostLikes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    const likes = await Like.find({ postId })
      .populate('userId', 'username fullName profilePicture')
      .sort({ createdAt: -1 });

    // Transform likes userId from _id to id
    const transformedLikes = likes.map((like) => {
      const likeObj = like.toObject();
      if (likeObj.userId && typeof likeObj.userId === 'object' && likeObj.userId._id) {
        likeObj.userId = {
          ...likeObj.userId,
          id: likeObj.userId._id.toString(),
        };
        delete likeObj.userId._id;
      }
      return likeObj;
    });

    res.json({ likes: transformedLikes });
  } catch (error) {
    throw error;
  }
};

export const addComment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    const validatedData = commentSchema.parse(req.body);
    const { text } = validatedData;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const comment = new Comment({
      userId: req.userId!,
      postId,
      text,
    });

    await comment.save();
    await comment.populate('userId', 'username fullName profilePicture');

    const commentObj = comment.toObject();
    // Transform userId to have 'id' instead of '_id' for frontend compatibility
    if (commentObj.userId && typeof commentObj.userId === 'object' && commentObj.userId._id) {
      commentObj.userId = {
        ...commentObj.userId,
        id: commentObj.userId._id.toString(),
      };
      delete commentObj.userId._id;
    }

    res.status(201).json({ comment: commentObj });
  } catch (error) {
    throw error;
  }
};

export const getPostComments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: 'Invalid post ID' });
      return;
    }

    const comments = await Comment.find({ postId })
      .populate('userId', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Transform comments userId from _id to id
    const transformedComments = comments.map((comment) => {
      const commentObj = comment.toObject();
      if (commentObj.userId && typeof commentObj.userId === 'object' && commentObj.userId._id) {
        commentObj.userId = {
          ...commentObj.userId,
          id: commentObj.userId._id.toString(),
        };
        delete commentObj.userId._id;
      }
      return commentObj;
    });

    const totalComments = await Comment.countDocuments({ postId });

    res.json({
      comments: transformedComments,
      pagination: {
        page,
        limit,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.userId!;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json({ error: 'Invalid comment ID' });
      return;
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    if (comment.userId.toString() !== userId) {
      const post = await Post.findById(postId);
      if (!post || post.userId.toString() !== userId) {
        res.status(403).json({
          error: 'Not authorized to delete this comment',
        });
        return;
      }
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    throw error;
  }
};

