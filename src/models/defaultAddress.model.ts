import { Schema, model } from "mongoose";

const defaultAddressSchema = new Schema(
  {
    address: {
      type: Schema.Types.ObjectId,
      ref: "address",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DefaultAddressModel = model("defaultAddress", defaultAddressSchema);

export { DefaultAddressModel };
