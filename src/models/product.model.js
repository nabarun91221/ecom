import {
  PRODUCT_STATUS,
  PRODUCT_SIZES,
  PRODUCT_CATEGORIES
} from "../constants/product.enums.js";

import mongoose from "mongoose";
import { generateNgrams } from "../utils/generateNgrams.js";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, enum: PRODUCT_CATEGORIES, required: true },
    size: { type: String, required: true },
    stock: { type: Number, required: true },
    color: { type: String, required: true },
    status: { type: String, enum: PRODUCT_STATUS, default: "active" },
    images: {
      type: [String],
      default:"https://res.cloudinary.com/dm6sdxom1/image/upload/v1769963494/shirt_btgyhg.png"
    },
    isDeleted: { type: Boolean, default: false },

    searchTokens: {
      type: [String],
      index: true
    }
  },
  { timestamps: true }
);


schema.pre("save", async function () {
  const text = this.name
  this.searchTokens = generateNgrams(text);
});


schema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  const data = update.$set || update;

  if (data.name) {
    const text = this.name;
    update.$set = {
      ...update.$set,
      searchTokens: generateNgrams(text)
    };
  }
});

export default mongoose.model("Product", schema);
