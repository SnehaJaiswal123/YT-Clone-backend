import express from 'express'
import jwtVerify from '../middlewares/jwtVerify.js';
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from '../controllers/playlist.controller.js';
const router = express.Router();

router.use(jwtVerify)

router.route('/:playlisId')
.get(getPlaylistById)
.delete(deletePlaylist)
.patch(updatePlaylist)

router.post('/', createPlaylist)
router.get('/user/:userId', getUserPlaylists)
router.patch('/addVideo/:videoId/:playlistId', addVideoToPlaylist)
router.patch('/removeVideo/:videoId/:playlistId', removeVideoFromPlaylist)

export default router
