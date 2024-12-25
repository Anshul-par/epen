import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    company: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    media: {
      type: Schema.Types.ObjectId,
      ref: "media",
    },
  },
  {
    timestamps: true,
  }
);

const ContactModel = model("contact", contactSchema);

export { ContactModel };
