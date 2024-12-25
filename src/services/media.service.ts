import { APIError } from "../errors/apiError";
import { StatusCodes } from "http-status-codes";
import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import { Types } from "mongoose";
import { MediaModel } from "../models/media.model";
import { IMedia } from "../types/model.types";

export const uploadMediaToS3 = async (file: Buffer, mimetype: string) => {
  try {
    if (!file) throw new Error("No files to upload");

    const s3 = new S3({
      endpoint: process.env.S3_END_POINT,
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_DO,
        secretAccessKey: process.env.AWS_SECRET_KEY_DO,
      },
    });

    const _id = new Types.ObjectId().toString();
    const uploadedMedia = await new Upload({
      client: s3,
      params: {
        ContentType: mimetype,
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `/${Date.now() + "_" + _id}.${mimetype.split("/")[1]}`,
        Body: file,
        ACL: "public-read",
      },
    }).done();

    return {
      _id: _id,
      url: uploadedMedia.Key,
    };
  } catch (error) {
    console.log("Error while uploading media to S3", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteMediaFromDB = async (media_id: string) => {
  try {
    await MediaModel.findByIdAndDelete(media_id);
  } catch (error) {
    console.error(`Error while deleting image from DB: ${error}`);
    throw new Error(`Error while deleting image from DB: ${error.message}`);
  }
};

export const getMediaByIdFromDB = async (id: string) => {
  try {
    const m = await MediaModel.findOne({ _id: id }).lean();
    return m;
  } catch (error) {
    console.error(`Error fetching media:`, error);
    throw new Error(`Error fetching media: ${error.message}`);
  }
};

export const saveMediaInDB = async (media: IMedia) => {
  try {
    const m = await MediaModel.create(media);
    console.log("Media saved successfully:", m);
    return m.toObject();
  } catch (error) {
    console.error("Error saving media:", error);
    throw new Error(`Error saving media: ${error.message}`);
  }
};
