import express, {Router} from 'express'

import {
    addComment,
    getCommentsByPost,
    deleteComment,
    getAllComments
} from '../controllers/commentsController'
import protect from '../middleware/authMiddleware';

const router: Router = express.Router();

router.post('/:postId', protect, addComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:commentId', protect, deleteComment);
router.get('/', getAllComments);

const commentsRouter = router;
export default commentsRouter;