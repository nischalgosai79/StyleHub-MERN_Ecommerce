
import express from "express";

import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSettingsController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Anyone can read store settings
router.get("/", getSiteSettings);

// Only logged-in admins can update settings
router.put("/", protect, adminOnly, updateSiteSettings);

export default router;
