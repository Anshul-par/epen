import { Response } from "express";
import { Request } from "../types/request.types";
import { saveMediaInDB, uploadMediaToS3 } from "../services/media.service";
import {
  createClientService,
  deleteClientService,
  findClientService,
  updateClientService,
} from "../services/client.service";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { APIError } from "../errors/apiError";
import { ClientStoryModel } from "../models/clientstory.model";

export const createClientController = async (req: Request, res: Response) => {
  const payload = req.body;
  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);

  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      mime: file.mimetype,
      description: "",
      url: url,
      title: "",
      _id: _id,
    });

    payload.image = media._id;
  }

  const client = await createClientService({
    ...payload,
    tags: payload.tags
      .split(",")
      .filter(Boolean)
      .map((tag: string) => tag.trim()),
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Client created successfully",
    data: { ...client },
    success: true,
  });
};

export const getClientsController = async (req: Request, res: Response) => {
  const isAdminRequested = req?.authUser?.role === "ADMIN";
  const clients = await findClientService({
    query: {},
    populate: ["image"],
    ...(isAdminRequested ? {} : { hidden: false }),
    isAdminRequested,
  });
  return res.status(StatusCodes.OK).json({
    message: "Clients fetched successfully",
    data: clients,
    success: true,
  });
};

export const getSingleClientController = async (
  req: Request,
  res: Response
) => {
  const userId = req.params.id;

  const user = await findClientService({
    query: {
      _id: new Types.ObjectId(userId),
    },
    populate: ["image"],
  });

  if (!user.length) {
    throw new APIError(StatusCodes.NOT_FOUND, "User not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Client fetched successfully",
    data: user[0],
    success: true,
  });
};

export const updateClientController = async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await findClientService({
    query: {
      _id: new Types.ObjectId(userId),
    },
  });

  if (!user.length) {
    throw new APIError(StatusCodes.NOT_FOUND, "User not found");
  }

  const payload = req.body;
  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);

  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      mime: file.mimetype,
      description: "",
      url: url,
      title: "",
      _id: _id,
    });
    payload.image = media._id;
  }

  const client = await updateClientService({
    query: {
      _id: new Types.ObjectId(userId),
    },
    update: {
      ...payload,
    },
  });

  const story = await ClientStoryModel.findOne({
    client: client._id,
  })
    .populate("components.image components.bgImage icon_image")
    .lean();

  return res.status(StatusCodes.OK).json({
    message: "Client updated successfully",
    data: { ...client, story },
    success: true,
  });
};

export const deleteClientController = async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await findClientService({
    query: {
      _id: new Types.ObjectId(userId),
    },
  });

  if (!user.length) {
    throw new APIError(StatusCodes.NOT_FOUND, "User not found");
  }

  const client = await deleteClientService({
    _id: new Types.ObjectId(userId),
  });

  return res.status(StatusCodes.OK).json({
    message: "Client deleted successfully",
    data: client,
    success: true,
  });
};
