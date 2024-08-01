import { Router } from "express";
const router=Router();
import { Register } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";

router.post('/register',upload.single('avatar'),Register)

export default router