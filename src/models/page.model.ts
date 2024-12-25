import { Schema, model } from "mongoose";

const PageSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  components: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        bgImage: {
          type: Schema.Types.ObjectId,
          ref: "media",
        },
        image: {
          type: Schema.Types.ObjectId,
          ref: "media",
        },
        bgVideo: {
          type: Schema.Types.ObjectId,
          ref: "media",
        },
        mainHeading: {
          type: String,
          required: true,
        },
        subHeading: {
          type: String,
        },
        CTA_text: {
          type: String,
        },
        order: {
          type: Number,
        },
        others: {
          type: Schema.Types.Mixed,
        },
      },
    ],
    required: true,
  },
});

export const PageModel = model("page", PageSchema);
