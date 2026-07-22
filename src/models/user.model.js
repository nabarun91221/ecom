import mongoose from "mongoose";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const hashPassword = password => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
}, { timestamps: true });

userSchema.methods.setPassword = function (password) { this.password = hashPassword(password); };
userSchema.methods.verifyPassword = function (password) {
  const [salt, saved] = this.password.split(":");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(saved, "hex"), Buffer.from(derived, "hex"));
};

export default mongoose.model("User", userSchema);
