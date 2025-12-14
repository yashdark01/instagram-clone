import { Response } from 'express';
import { Post } from '../models/Post';
import { Like } from '../models/Like';
import { Comment } from '../models/Comment';
import { Follow } from '../models/Follow';
import { AuthRequest } from '../middleware/auth';

export const getFeed = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get list of users that the current user follows
    const following = await Follow.find({ followerId: userId }).select(
      'followingId'
    );
    const followingIds = following.map((f) => f.followingId);

    let posts;
    let totalPosts;

    // If user doesn't follow anyone, show all posts
    if (followingIds.length === 0) {
      posts = await Post.find()
        .populate('userId', 'username fullName profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      totalPosts = await Post.countDocuments();
    } else {
      // Get posts from followed users
      posts = await Post.find({ userId: { $in: followingIds } })
        .populate('userId', 'username fullName profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      totalPosts = await Post.countDocuments({
        userId: { $in: followingIds },
      });
    }

    // Get likes and comments for each post
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({
          postId: post._id,
        });
        const isLiked = !!(await Like.findOne({
          userId,
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

