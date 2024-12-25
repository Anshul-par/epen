import { Schema, model } from "mongoose";
import { IFAQ } from "../types/model.types";

const FAQSchema = new Schema<IFAQ>(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
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

export const FAQModel = model<IFAQ>("faq", FAQSchema);
