import { Router } from "express";

import { registration } from '../users/user.controller.js'

const router = Router();

router.post("/register",registration);
export default router;