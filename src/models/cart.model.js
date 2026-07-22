import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, min: 1, default: 1 },
  savedForLater: { type: Boolean, default: false }
});

export default mongoose.model("Cart", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  items: { type: [itemSchema], default: [] }
}, { timestamps: true }));
