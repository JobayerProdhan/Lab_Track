import { Router } from "express";

import { registration } from '../users/user.controller.js'
import { login_user } from './auth.controller.js';


const router = Router();

router.post("/register",registration);
router.post("/login",login_user);

export default router;