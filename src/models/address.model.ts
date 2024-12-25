import { Schema, model } from "mongoose";
import { IAddress } from "../types/model.types";

const AddressSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: false },
    address: { type: String, required: true },
    addressLine2: { type: String, required: false },
    city: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String, required: false },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  {
    timestamps: true,
  }
);

export const AddressModel = model<IAddress>("address", AddressSchema);
