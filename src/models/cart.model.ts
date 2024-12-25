import { Schema, model } from "mongoose";
import { ICart } from "../types/model.types";

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["active", "converted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const CartModel = model<ICart>("Cart", CartSchema);
