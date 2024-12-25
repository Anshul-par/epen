import { Schema, model } from "mongoose";

const productDetailsSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
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

export const ProductDetailModel = model("productdetails", productDetailsSchema);
