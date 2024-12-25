import mongoose, { Schema } from "mongoose";
import { IAboutUs } from "../types/model.types";

const AboutUsSchema: Schema = new Schema(
  {
    address: { type: String, required: true },
    phone: { type: String, required: true },
    aboutus: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const AboutUsModel = mongoose.model<IAboutUs>("AboutUs", AboutUsSchema);
