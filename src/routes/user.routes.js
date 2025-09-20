import { Router } from "express";
const router=Router();
import { Register, changeCurrentPass, login, logout, refreshAccessToken, updateAccountDetails, updateAvatar, updateCoverImage, getCurrentUser} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";
import jwtVerify from "../middlewares/jwtVerify.js";

router.get('/getCurrUser', jwtVerify, getCurrentUser)
router.post('/register',upload.fields([{name:'avatar',maxCount:1},{name:'coverImage', maxCount:1}]),Register)
router.post('/login',login)
router.post('/logout',jwtVerify,logout)
router.post('/refreshToken',refreshAccessToken);
router.post('/changePass',jwtVerify,changeCurrentPass);
router.post('/updateDetails', jwtVerify, updateAccountDetails);
router.post('/updateAvatar', jwtVerify, upload.single('avatar'), updateAvatar);
router.post('/updateCoverImage', jwtVerify, upload.single('coverImage'), updateCoverImage);

export default router