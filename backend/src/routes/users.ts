import { Router } from 'express';
import {
  getUserProfile,
  getUserPosts,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Search route must come before /:userId routes to avoid route conflicts
router.get('/search', authMiddleware, searchUsers);
router.get('/:userId', authMiddleware, getUserProfile);
router.get('/:userId/posts', authMiddleware, getUserPosts);
router.post('/:userId/follow', authMiddleware, followUser);
router.delete('/:userId/follow', authMiddleware, unfollowUser);
router.get('/:userId/followers', authMiddleware, getFollowers);
router.get('/:userId/following', authMiddleware, getFollowing);

export default router;

