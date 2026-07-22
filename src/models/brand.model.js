import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);
