import express from 'express'
import { publishVideo, getVideoById, togglePublishStatus, deleteVideo, updateVideo, getAllVideos } from '../controllers/video.controller.js'
import jwtVerify from '../middlewares/jwtVerify.js';
import upload from '../middlewares/multer.js';
const router = express.Router();

router.get('/',getAllVideos)
router.post('/', jwtVerify,
   upload.fields([{name:'video',maxCount:1},{name:'thumbnail',maxCount:1}]),
   publishVideo)
router.patch('/togglePublishStatus/:videoId', jwtVerify, togglePublishStatus)

router.route('/:videoId')
router.get(jwtVerify, getVideoById)
router.patch(jwtVerify, updateVideo)
router.delete(jwtVerify, deleteVideo)

export default router
