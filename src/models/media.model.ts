import { Schema, model } from "mongoose";
import { IMedia } from "../types/model.types";

const MediaSchema = new Schema<IMedia>(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    mime: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const MediaModel = model<IMedia>("media", MediaSchema);

export { MediaModel };
