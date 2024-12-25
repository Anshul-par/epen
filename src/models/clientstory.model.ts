import { Schema, model } from "mongoose";

const ClientStorySchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  icon_image: {
    type: Schema.Types.ObjectId,
    ref: "media",
  },
  components: [
    {
      name: {
        type: String,
        required: true,
      },
      order: {
        type: Number,
      },
      bgImage: {
        type: Schema.Types.ObjectId,
        ref: "media",
      },
      image: {
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
      others: {
        type: Schema.Types.Mixed,
      },
    },
  ],
});

export const ClientStoryModel = model("clientstory", ClientStorySchema);
