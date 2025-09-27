import express from 'express'
import jwtVerify from '../middlewares/jwtVerify.js';
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from '../controllers/subscription.controller.js';
const router = express.Router();

router.get('/c/:channelId', jwtVerify, getUserChannelSubscribers)
router.post('/c/:channelId', jwtVerify, toggleSubscription)
router.get('/u/:subscriberId', jwtVerify, getSubscribedChannels)

export default router
