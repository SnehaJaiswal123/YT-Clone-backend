import express from 'express'
import jwtVerify from '../middlewares/jwtVerify.js';
import { getVideoComments, addComment, deleteComment, updateComment } from '../controllers/comment.controller.js';
const router = express.Router();

router.use(jwtVerify)

router.route('/:videoId')
.get(getVideoComments)
.post(addComment)
router.route('/c/:commentId')
.patch(updateComment)
.delete(deleteComment)

export default router
