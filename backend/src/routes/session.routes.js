import { Router } from "express";

import { saveSession, getSessions } from "../controllers/session.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Save a typing session (login required)
router.post("/", verifyJWT, saveSession);

// Get the logged-in user's typing history
router.get("/", verifyJWT, getSessions);

export default router;
