import { Request, Response } from "express";
import { ClientStoryModel } from "../models/clientstory.model";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../errors/apiError";
import { findClientService } from "../services/client.service";
import { IClientStory } from "../types/model.types";

export const createClientStoryController = async (
  req: Request,
  res: Response
) => {
  const { client, components, icon_image }: IClientStory = req.body;

  // Clean Empty Strings from components
  const c = components.map((component) => {
    for (const key in component) {
      if (component.hasOwnProperty(key) && component[key] === "") {
        delete component[key];
      }
    }

    return component;
  });

  const clientStory = await ClientStoryModel.create({
    components: c,
    client,
    ...(icon_image ? { icon_image } : {}),
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Client Story created successfully",
    data: clientStory,
    success: true,
  });
};

export const updateClientStoryController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { client: cl, components, icon_image }: IClientStory = req.body;

  // Clean Empty Strings from components
  const c = components.map((component) => {
    for (const key in component) {
      if (component.hasOwnProperty(key) && component[key] === "") {
        delete component[key];
      }
    }

    return component;
  });

  const clientStory = await ClientStoryModel.findByIdAndUpdate(id, {
    components: c,
    client: cl,
    ...(icon_image ? { icon_image } : {}),
  });

  const client = await findClientService({
    query: { _id: clientStory.client },
    populate: ["image"],
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Client Story created successfully",
    data: { ...client, story: clientStory },
    success: true,
  });
};

export const getClientStoryController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const clientStories = await ClientStoryModel.findOne({
    client: id,
  })
    .populate("icon_image")
    .populate("components.image")
    .populate("components.bgImage")
    .lean();

  if (!clientStories) {
    throw new APIError(StatusCodes.NOT_FOUND, "Client Stories not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Client Stories fetched successfully",
    data: {
      ...clientStories,
      components: clientStories.components.sort((a, b) => a.order - b.order),
    },
    success: true,
  });
};

export const getClientStorySuggestionsController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const clients = await findClientService({
    query: { _id: id },
  });
  const similarClients = [];

  for (const c of clients) {
    const similar = await findClientService({
      query: {
        tags: { $in: c.tags },
      },
    });

    similarClients.push(...similar);
  }

  const clientStories = await ClientStoryModel.find({
    client: { $in: similarClients.map((c) => c._id) },
    icon_image: { $ne: "6764eb4b0228d58f509982c4" },
  })
    .select("client icon_image")
    .populate("icon_image")
    .populate("client")
    .lean();

  if (!clientStories) {
    throw new APIError(StatusCodes.NOT_FOUND, "Client Stories not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "client stories suggestions fetched successfully",
    data: {
      heading: "Similar Stories",
      subHeading:
        "Here you can see other project stories that are similar to this one, check now!",
      stories: clientStories.sort(() => Math.random() - 0.5).slice(0, 3),
    },
    success: true,
  });
};
