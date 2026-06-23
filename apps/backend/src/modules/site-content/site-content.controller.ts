import { Request, Response } from "express";
import { SiteContentService } from "./site-content.service";
import { StorageService } from "../../services/storage.service";
import { updateContentSchema, bulkUpdateSchema } from "./site-content.schema";

export class SiteContentController {
  // --- Public GET all active content ---
  static async getPublicContent(req: Request, res: Response): Promise<void> {
    try {
      const hero = await SiteContentService.getActiveHeroImages();
      const about = await SiteContentService.getActiveAboutImages();
      const gallery = await SiteContentService.getActiveGalleryImages();

      res.status(200).json({ success: true, data: { hero, about, gallery } });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch site content" });
    }
  }

  // --- Hero Image Upload ---
  static async uploadHero(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: "No image file provided" });
        return;
      }

      const imageUrl = await StorageService.uploadImage(req.file.buffer, req.file.mimetype, "hero");
      const heroImage = await SiteContentService.addHeroImage(imageUrl);

      res.status(201).json({ success: true, data: heroImage });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // --- About Image Upload ---
  static async uploadAbout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: "No image file provided" });
        return;
      }

      const imageUrl = await StorageService.uploadImage(req.file.buffer, req.file.mimetype, "about");
      const aboutImage = await SiteContentService.addAboutImage(imageUrl);

      res.status(201).json({ success: true, data: aboutImage });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // --- Gallery Image Upload ---
  static async uploadGallery(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: "No image file provided" });
        return;
      }

      const imageUrl = await StorageService.uploadImage(req.file.buffer, req.file.mimetype, "gallery");
      const altText = req.body.altText || null;
      
      const galleryImage = await SiteContentService.addGalleryImage(imageUrl, altText);

      res.status(201).json({ success: true, data: galleryImage });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // --- Update Content ---
  static async updateContent(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type as string;
      const id = req.params.id as string;
      const parsedBody = updateContentSchema.safeParse(req.body);

      if (!parsedBody.success) {
        res.status(400).json({ success: false, error: parsedBody.error.issues });
        return;
      }

      // Check limit if trying to activate
      if (parsedBody.data.isActive === true) {
        const canActivate = await SiteContentService.checkLimit(type);
        if (!canActivate) {
          res.status(400).json({ success: false, error: "Maximum active limit reached for this section" });
          return;
        }
      }

      let updatedRecord;

      switch (type) {
        case "hero":
          updatedRecord = await SiteContentService.updateHeroImage(id, parsedBody.data);
          break;
        case "about":
          updatedRecord = await SiteContentService.updateAboutImage(id, parsedBody.data);
          break;
        case "gallery":
          updatedRecord = await SiteContentService.updateGalleryImage(id, parsedBody.data);
          break;
        default:
          res.status(400).json({ success: false, error: "Invalid content type" });
          return;
      }

      res.status(200).json({ success: true, data: updatedRecord });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // --- Delete Content ---
  static async deleteContent(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type as string;
      const id = req.params.id as string;

      // Delete Protection: Check if image is currently active
      const isActive = await SiteContentService.checkIsActive(type, id);
      if (isActive) {
        res.status(400).json({ success: false, error: "Cannot delete an active image. Please deactivate it first." });
        return;
      }

      let deletedRecord: any;

      switch (type) {
        case "hero":
          deletedRecord = await SiteContentService.deleteHeroImage(id);
          break;
        case "about":
          deletedRecord = await SiteContentService.deleteAboutImage(id);
          break;
        case "gallery":
          deletedRecord = await SiteContentService.deleteGalleryImage(id);
          break;
        default:
          res.status(400).json({ success: false, error: "Invalid content type" });
          return;
      }

      // Also delete from Supabase storage
      if (deletedRecord && deletedRecord.imageUrl) {
        await StorageService.deleteImage(deletedRecord.imageUrl);
      }

      res.status(200).json({ success: true, message: `${type} image deleted successfully` });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // --- Admin GET all content ---
  static async getAllContent(req: Request, res: Response): Promise<void> {
    try {
      const hero = await SiteContentService.getHeroImages();
      const about = await SiteContentService.getAboutImages();
      const gallery = await SiteContentService.getGalleryImages();

      res.status(200).json({ success: true, data: { hero, about, gallery } });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch site content" });
    }
  }

  // --- Bulk Update Active Status ---
  static async bulkUpdateActive(req: Request, res: Response): Promise<void> {
    try {
      const type = req.params.type as string;
      const parsedBody = bulkUpdateSchema.safeParse(req.body);

      if (!parsedBody.success) {
        res.status(400).json({ success: false, error: parsedBody.error.issues });
        return;
      }

      const result = await SiteContentService.bulkUpdateActive(type, parsedBody.data.updates);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      const statusCode = error.message.includes("Maximum active limit") ? 400 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  }
}
