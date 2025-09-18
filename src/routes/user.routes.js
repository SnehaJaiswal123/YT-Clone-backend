import { Router } from "express";
const router=Router();
import { Register, login } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";

router.post('/register',upload.fields([{name:'avatar',maxCount:1},{name:'coverImage', maxCount:1}]),Register)
router.post('/login',login)

export default router