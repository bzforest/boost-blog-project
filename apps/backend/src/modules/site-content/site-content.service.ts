import { prisma } from "../../lib/db";

export class SiteContentService {
  // --- Hero Images ---
  static async getHeroImages() {
    return prisma.heroImage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getActiveHeroImages() {
    return prisma.heroImage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async addHeroImage(imageUrl: string) {
    return prisma.heroImage.create({
      data: { imageUrl, isActive: false },
    });
  }

  static async updateHeroImage(id: string, data: { isActive?: boolean }) {
    return prisma.heroImage.update({
      where: { id },
      data,
    });
  }

  static async deleteHeroImage(id: string) {
    return prisma.heroImage.delete({
      where: { id },
    });
  }

  // --- About Images ---
  static async getAboutImages() {
    return prisma.aboutImage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getActiveAboutImages() {
    return prisma.aboutImage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async addAboutImage(imageUrl: string) {
    return prisma.aboutImage.create({
      data: { imageUrl, isActive: false },
    });
  }

  static async updateAboutImage(id: string, data: { isActive?: boolean }) {
    return prisma.aboutImage.update({
      where: { id },
      data,
    });
  }

  static async deleteAboutImage(id: string) {
    return prisma.aboutImage.delete({
      where: { id },
    });
  }

  // --- Gallery Images ---
  static async getGalleryImages() {
    return prisma.galleryImage.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  static async getActiveGalleryImages() {
    return prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  static async addGalleryImage(imageUrl: string, altText?: string) {
    // Find highest sort order
    const lastImage = await prisma.galleryImage.findFirst({
      orderBy: { sortOrder: "desc" },
    });
    const nextSortOrder = lastImage ? lastImage.sortOrder + 1 : 1;

    return prisma.galleryImage.create({
      data: { imageUrl, altText, sortOrder: nextSortOrder, isActive: false },
    });
  }

  static async updateGalleryImage(
    id: string,
    data: { isActive?: boolean; altText?: string | null; sortOrder?: number }
  ) {
    return prisma.galleryImage.update({
      where: { id },
      data,
    });
  }

  static async deleteGalleryImage(id: string) {
    return prisma.galleryImage.delete({
      where: { id },
    });
  }

  // --- Limit Validation ---
  static async checkLimit(type: string): Promise<boolean> {
    const limits: Record<string, number> = {
      hero: 7,
      about: 1,
      gallery: 12,
    };

    const limit = limits[type];
    if (limit === undefined) return false;

    let currentActiveCount = 0;
    switch (type) {
      case "hero":
        currentActiveCount = await prisma.heroImage.count({ where: { isActive: true } });
        break;
      case "about":
        currentActiveCount = await prisma.aboutImage.count({ where: { isActive: true } });
        break;
      case "gallery":
        currentActiveCount = await prisma.galleryImage.count({ where: { isActive: true } });
        break;
    }

    return currentActiveCount < limit;
  }

  // --- Check Active Status (for Delete Protection) ---
  static async checkIsActive(type: string, id: string): Promise<boolean> {
    let record;
    switch (type) {
      case "hero":
        record = await prisma.heroImage.findUnique({ where: { id }, select: { isActive: true } });
        break;
      case "about":
        record = await prisma.aboutImage.findUnique({ where: { id }, select: { isActive: true } });
        break;
      case "gallery":
        record = await prisma.galleryImage.findUnique({ where: { id }, select: { isActive: true } });
        break;
    }
    return record?.isActive || false;
  }

  // --- Bulk Update Active Status ---
  static readonly ACTIVE_LIMITS: Record<string, number> = {
    hero: 7,
    about: 1,
    gallery: 12,
  };

  static async bulkUpdateActive(
    type: string,
    updates: { id: string; isActive: boolean }[]
  ) {
    const limit = SiteContentService.ACTIVE_LIMITS[type];
    if (limit === undefined) {
      throw new Error("Invalid content type");
    }

    // Get all current images for this type to calculate the resulting active count
    let allImages: { id: string; isActive: boolean }[] = [];
    switch (type) {
      case "hero":
        allImages = await prisma.heroImage.findMany({ select: { id: true, isActive: true } });
        break;
      case "about":
        allImages = await prisma.aboutImage.findMany({ select: { id: true, isActive: true } });
        break;
      case "gallery":
        allImages = await prisma.galleryImage.findMany({ select: { id: true, isActive: true } });
        break;
    }

    // Build a map of the intended final state
    const updateMap = new Map(updates.map((u) => [u.id, u.isActive]));

    // Calculate the resulting active count after applying all updates
    let resultingActiveCount = 0;
    for (const img of allImages) {
      const intendedActive = updateMap.has(img.id) ? updateMap.get(img.id)! : img.isActive;
      if (intendedActive) resultingActiveCount++;
    }

    if (resultingActiveCount > limit) {
      throw new Error(
        `Maximum active limit reached for ${type}. Allowed: ${limit}, Resulting: ${resultingActiveCount}`
      );
    }

    // Perform all updates in a single transaction
    const prismaModel =
      type === "hero" ? prisma.heroImage :
      type === "about" ? prisma.aboutImage :
      prisma.galleryImage;

    await prisma.$transaction(
      updates.map((u) =>
        (prismaModel as any).update({
          where: { id: u.id },
          data: { isActive: u.isActive },
        })
      )
    );

    return { success: true, updatedCount: updates.length };
  }
}
