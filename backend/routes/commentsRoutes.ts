import {Router} from 'express';
import {addComment, getCommentsByTask, getCommentsByUser, getAllComments} from '../controllers/commentController';
import {protect, adminOnly} from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/add', protect, addComment);
router.get('/:taskId', protect, getCommentsByTask);
router.get('/', protect, getCommentsByUser);
router.get('/all', protect, adminOnly,getAllComments);

export default router;