import { Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { Follow } from '../models/Follow';
import { Like } from '../models/Like';
import { Comment } from '../models/Comment';
import { AuthRequest } from '../middleware/auth';

export const getUserProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const followersCount = await Follow.countDocuments({
      followingId: userId,
    });

    const followingCount = await Follow.countDocuments({
      followerId: userId,
    });

    const isFollowing = req.userId
      ? !!(await Follow.findOne({
          followerId: req.userId,
          followingId: userId,
        }))
      : false;

    res.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount,
        followingCount,
        isFollowing,
        isOwnProfile: req.userId === userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getUserPosts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const posts = await Post.find({ userId })
      .populate('userId', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get likes and comments for each post
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({
          postId: post._id,
        });
        const isLiked = !!(await Like.findOne({
          userId: currentUserId,
          postId: post._id,
        }));

        const comments = await Comment.find({ postId: post._id })
          .populate('userId', 'username fullName profilePicture')
          .sort({ createdAt: -1 })
          .limit(10);

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

        return {
          ...postObj,
          likesCount,
          isLiked,
          comments: transformedComments,
        };
      })
    );

    const totalPosts = await Post.countDocuments({ userId });

    res.json({
      posts: postsWithDetails,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const followUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const followerId = req.userId!;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (followerId === userId) {
      res.status(400).json({ error: 'Cannot follow yourself' });
      return;
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const existingFollow = await Follow.findOne({
      followerId,
      followingId: userId,
    });

    if (existingFollow) {
      res.status(400).json({ error: 'Already following this user' });
      return;
    }

    const follow = new Follow({
      followerId,
      followingId: userId,
    });

    await follow.save();

    res.json({ message: 'User followed successfully' });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Already following this user' });
      return;
    }
    throw error;
  }
};

export const unfollowUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const followerId = req.userId!;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const follow = await Follow.findOneAndDelete({
      followerId,
      followingId: userId,
    });

    if (!follow) {
      res.status(404).json({ error: 'Not following this user' });
      return;
    }

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    throw error;
  }
};

export const getFollowers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const follows = await Follow.find({ followingId: userId })
      .populate('followerId', 'username fullName profilePicture')
      .sort({ createdAt: -1 });

    // Transform userId from _id to id
    const followers = follows.map((f) => {
      const user = f.followerId as any;
      if (user && user._id) {
        return {
          ...user.toObject ? user.toObject() : user,
          id: user._id.toString(),
        };
      }
      return user;
    }).map((user: any) => {
      if (user && user._id) {
        delete user._id;
      }
      return user;
    });

    res.json({ followers });
  } catch (error) {
    throw error;
  }
};

export const getFollowing = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const follows = await Follow.find({ followerId: userId })
      .populate('followingId', 'username fullName profilePicture')
      .sort({ createdAt: -1 });

    // Transform userId from _id to id
    const following = follows.map((f) => {
      const user = f.followingId as any;
      if (user && user._id) {
        return {
          ...user.toObject ? user.toObject() : user,
          id: user._id.toString(),
        };
      }
      return user;
    }).map((user: any) => {
      if (user && user._id) {
        delete user._id;
      }
      return user;
    });

    res.json({ following });
  } catch (error) {
    throw error;
  }
};

export const searchUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } },
      ],
    })
      .select('-password')
      .limit(10);

    // Transform userId from _id to id
    const transformedUsers = users.map((user) => ({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture,
    }));

    res.json({ users: transformedUsers });
  } catch (error) {
    throw error;
  }
};

