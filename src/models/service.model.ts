import { Schema, model } from "mongoose";
import { IService } from "../types/model.types";

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
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

const ServiceModel = model<IService>("service", ServiceSchema);

export { ServiceModel };
