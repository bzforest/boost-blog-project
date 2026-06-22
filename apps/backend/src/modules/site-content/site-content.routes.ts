import { Router } from "express";
import { SiteContentController } from "./site-content.controller";
import { upload } from "../../middlewares/upload.middleware";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// Public route (used by frontend)
router.get("/", SiteContentController.getPublicContent);

// Admin routes (requires authentication)
// GET all content (including inactive)
router.get("/admin", requireAuth, SiteContentController.getAllContent);

// Upload routes
router.post("/hero", requireAuth, upload.single("image"), SiteContentController.uploadHero);
router.post("/about", requireAuth, upload.single("image"), SiteContentController.uploadAbout);
router.post("/gallery", requireAuth, upload.single("image"), SiteContentController.uploadGallery);

// Update route
router.put("/:type/bulk-active", requireAuth, SiteContentController.bulkUpdateActive);
router.put("/:type/:id", requireAuth, SiteContentController.updateContent);

// Delete route
router.delete("/:type/:id", requireAuth, SiteContentController.deleteContent);

export default router;
