import { Schema, model } from "mongoose";
import { ISubService } from "../types/model.types";

const SubServiceSchema = new Schema<ISubService>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "service",
      required: true,
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

const SubServiceModel = model<ISubService>("subService", SubServiceSchema);

export { SubServiceModel };
