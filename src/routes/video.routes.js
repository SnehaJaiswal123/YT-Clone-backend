import express from 'express'
import { publishVideo, getVideoById, togglePublishStatus, deleteVideo, updateVideo, getAllVideos } from '../controllers/video.controller.js'
import jwtVerify from '../middlewares/jwtVerify.js';
import upload from '../middlewares/multer.js';
const router = express.Router();

router.get('/',getAllVideos)
router.post('/', jwtVerify,
   upload.fields([{name:'video',maxCount:1},{name:'thumbnail',maxCount:1}]),
   publishVideo)
router.get('/getVideo/:videoId', jwtVerify, getVideoById)
router.patch('/togglePublishStatus/:videoId', jwtVerify, togglePublishStatus)
router.patch('/updateVideo/:videoId', jwtVerify, updateVideo)
router.delete('/deleteVideo/:videoId', jwtVerify, deleteVideo)

export default router
