import { Router } from "express";
const router=Router();
import { Register, login, logout, refreshAccessToken} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";
import jwtVerify from "../middlewares/jwtVerify.js";

router.post('/register',upload.fields([{name:'avatar',maxCount:1},{name:'coverImage', maxCount:1}]),Register)
router.post('/login',login)
router.post('/logout',jwtVerify,logout)
router.post('/refreshToken',refreshAccessToken);

export default router