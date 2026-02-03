import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { configDotenv } from "dotenv";
import cloudinary from "../configs/clodinery.config.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..","uploads");

//checking if the "upload folder path exist"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
//File Filter
const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|avif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
//in server storage for development environment
const storage_server = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "");
    cb(null, `${Date.now()}-${safeName}`);
  }
});
//in cloud storage for "production" environment
const storage_cloudinery= new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp","avif"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

const upload = multer({
    storage:process.env.NODE_ENV==="production"?storage_cloudinery:storage_server,
    fileFilter
});

export default upload;
