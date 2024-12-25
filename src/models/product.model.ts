import { Schema, model } from "mongoose";
import { IProduct } from "../types/model.types";

const ProductSchema = new Schema<IProduct>({
  company_name: {
    type: String,
    default: "EPEN Ltd.",
  },
  product_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  heading_main: {
    type: String,
  },
  heading_sub: {
    type: String,
  },
  key_features: {
    type: Schema.Types.Mixed,
  },
  tags: [
    {
      type: String,
    },
  ],
  supported_platforms: [
    {
      type: String,
    },
  ],
  supported_gpu_architectures: [
    {
      type: String,
    },
  ],
  target_applications: [
    {
      type: String,
    },
  ],
  version: {
    type: String,
  },
  transformation_statement: {
    type: String,
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: "media",
    required: true,
  },
  icon_image: {
    type: Schema.Types.ObjectId,
    ref: "media",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const ProductModel = model<IProduct>("product", ProductSchema);

export { ProductModel };
