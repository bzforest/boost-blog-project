import { supabase } from "../lib/supabase";
import crypto from "crypto";

const BUCKET_NAME = "blog-image";

export class StorageService {
  /**
   * Uploads an image buffer to Supabase Storage and returns the public URL.
   * @param fileBuffer The buffer of the image file
   * @param mimetype The MIME type of the image file
   * @param folder The subfolder name (e.g. 'hero', 'about', 'gallery')
   * @returns The public URL of the uploaded image
   */
  static async uploadImage(
    fileBuffer: Buffer,
    mimetype: string,
    folder: string
  ): Promise<string> {
    // Generate a unique filename using built-in crypto module
    const extension = mimetype.split("/")[1] || "jpeg";
    const filename = `${crypto.randomUUID()}.${extension}`;
    const filePath = `${folder}/${filename}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  /**
   * Deletes an image from Supabase Storage given its URL.
   * @param publicUrl The public URL of the image
   */
  static async deleteImage(publicUrl: string): Promise<void> {
    try {
      const urlObj = new URL(publicUrl);
      const pathParts = urlObj.pathname.split("/");
      const bucketIndex = pathParts.findIndex((part) => part === BUCKET_NAME);
      
      if (bucketIndex !== -1 && pathParts.length > bucketIndex + 1) {
        // Construct the internal path by joining everything after the bucket name
        const filePath = pathParts.slice(bucketIndex + 1).join("/");
        
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([filePath]);
          
        if (error) {
          console.error("Error deleting image from Supabase:", error.message);
        }
      }
    } catch (e) {
      console.error("Invalid URL for deletion:", e);
    }
  }
}
