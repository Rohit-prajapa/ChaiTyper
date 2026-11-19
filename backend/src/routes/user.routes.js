import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { updateProfile } from "../controllers/auth.controller.js";

const router = Router();

router.get("/test-router", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User router is working",
  });
});

router.get("/me", verifyJWT, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
    },
  });
});

router.patch("/update-profile", verifyJWT, updateProfile);

export default router;
