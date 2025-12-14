import { Router } from 'express';
import {
  createPost,
  getPost,
  deletePost,
  likePost,
  unlikePost,
  getPostLikes,
  addComment,
  getPostComments,
  deleteComment,
} from '../controllers/postController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/:postId', authMiddleware, getPost);
router.delete('/:postId', authMiddleware, deletePost);
router.post('/:postId/like', authMiddleware, likePost);
router.delete('/:postId/like', authMiddleware, unlikePost);
router.get('/:postId/likes', authMiddleware, getPostLikes);
router.post('/:postId/comments', authMiddleware, addComment);
router.get('/:postId/comments', authMiddleware, getPostComments);
router.delete('/:postId/comments/:commentId', authMiddleware, deleteComment);

export default router;

