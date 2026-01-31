import multer from "multer";

// Use memory storage for Cloudinary uploads (files stored in memory, not on disk)
const storage = multer.memoryStorage();

export const upload = multer({storage: storage});