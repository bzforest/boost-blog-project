import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      data: { imageUrl, isActive: true },
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
      data: { imageUrl, isActive: true },
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
      data: { imageUrl, altText, sortOrder: nextSortOrder, isActive: true },
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
}
