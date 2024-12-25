import mongoose, { Schema } from "mongoose";
import { IClient } from "../types/model.types";

const ClientSchema: Schema = new Schema<IClient>(
  {
    clientname: { type: String, required: true },
    industry: { type: String, required: true },
    projectTitle: { type: String, required: true },
    tags: { type: [String], required: true },
    image: { type: Schema.Types.ObjectId, ref: "media" },
    hidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ClientModel = mongoose.model<IClient>("Client", ClientSchema);

export { ClientModel };
