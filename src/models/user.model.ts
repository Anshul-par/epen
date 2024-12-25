import { Schema, model } from "mongoose";
import { IUser } from "../types/model.types";

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    firebaseUserId: {
      type: String,
    },
    profileImage: {
      type: Schema.Types.ObjectId,
      ref: "media",
    },
    isEmailVerified: {
      type: Boolean,
    },
    email: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    isGoogleLogin: {
      type: Boolean,
    },
    isAppleLogin: {
      type: Boolean,
    },
    isBlocked: {
      type: Boolean,
    },
    isPurchased: {
      type: Boolean,
    },
    isSubscribe: {
      type: Boolean,
    },
    isFeedback: {
      type: Boolean,
    },
    activeSubscription: {
      type: Schema.Types.ObjectId,
      ref: "InApp",
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("user", userSchema);
