import express from 'express'
import jwtVerify from '../middlewares/jwtVerify.js';
import { toggleVideoLike, toggleCommentLike, getLikedVideos } from '../controllers/likes.controller.js';
const router = express.Router();

router.use(jwtVerify)

router.get('/videos',getLikedVideos)
router.patch('/video/:videoId', toggleVideoLike)
router.patch('/comment/:commentId', toggleCommentLike)

export default router
