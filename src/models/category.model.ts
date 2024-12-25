import { Schema, model } from "mongoose";
import { ICategory } from "../types/model.types";

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: Schema.Types.ObjectId,
      ref: "media",
    },
    icon_image: {
      type: Schema.Types.ObjectId,
      ref: "media",
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = model<ICategory>("category", CategorySchema);
