import multer from "multer";

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to allow only image files
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image file."));
  }
};

// Export the upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // Limit file size to 20MB
  },
});
