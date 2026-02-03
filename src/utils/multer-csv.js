import multer from "multer";
import { fileURLToPath } from "url"
import path from "path";
import { existsSync,mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}
const fileFilter = function (req, file, cb) {
  const allowedExt = /\.csv$/i;
  const allowedMime = "text/csv";

  if (!allowedExt.test(file.originalname) && file.mimetype !== allowedMime) {
    return cb(new Error("Only CSV files are allowed!"), false);
  }

  cb(null, true);
};

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
export const upload = multer({
    storage: storage_server,
    fileFilter
})