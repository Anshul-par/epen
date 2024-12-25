import { Response } from "express";
import { Request } from "../types/request.types";
import { StatusCodes } from "http-status-codes";
import { PageModel } from "../models/page.model";
import { IComponent, IPage } from "../types/model.types";
import { APIError } from "../errors/apiError";

export const createPageController = async (req: Request, res: Response) => {
  const payload: IPage = req.body;

  const page = await PageModel.create({
    ...payload,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Page created successfully",
    data: page,
    success: true,
  });
};

export const updatePageController = async (req: Request, res: Response) => {
  const { name } = req.params;
  const payload: IPage = req.body;

  const populated_page = await PageModel.findOneAndUpdate(
    { name },
    { ...payload },
    { new: true }
  )
    .populate("components.bgImage components.bgVideo components.image")
    .lean();

  if (!populated_page) {
    throw new APIError(StatusCodes.NOT_FOUND, "Page not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Page updated successfully",
    data: populated_page,
    success: true,
  });
};

export const getSinglePageController = async (req: Request, res: Response) => {
  const { name } = req.params;
  const page = await PageModel.findOne({ name })
    .populate({
      path: "components.image",
    })
    .populate({
      path: "components.bgImage",
    });

  if (!page) {
    throw new APIError(StatusCodes.NOT_FOUND, "Page not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Page fetched successfully",
    data: page,
    success: true,
  });
};

// export const addPageSectionController = async (req: Request, res: Response) => {
//   const { name } = req.params;
//   const payload: IComponent = req.body;

//   const page = await PageModel.findOneAndUpdate(
//     { name },
//     { $push: { components: payload } },
//     { new: true }
//   );

//   if (!page) {
//     throw new APIError(StatusCodes.NOT_FOUND, "Page not found");
//   }

//   return res.status(StatusCodes.CREATED).json({
//     message: "Page Section added successfully",
//     data: page,
//     success: true,
//   });
// };

// export const updatePageSectionController = async (
//   req: Request,
//   res: Response
// ) => {
//   const { name, sectionId } = req.params;
//   const payload: IComponent = req.body;

//   const page = await PageModel.findOneAndUpdate(
//     { name, components: { $in: { _id: [sectionId] } } },
//     { ...payload },
//     { new: true }
//   );

//   if (!page) {
//     throw new APIError(StatusCodes.NOT_FOUND, "Page not found");
//   }

//   return res.status(StatusCodes.OK).json({
//     message: "Page updated successfully",
//     data: page,
//     success: true,
//   });
// };

// export const deletePageSectionController = async (
//   req: Request,
//   res: Response
// ) => {
//   const { name, sectionId } = req.params;

//   const page = await PageModel.findOneAndUpdate(
//     { name },
//     { $pull: { components: { _id: sectionId } } },
//     { new: true }
//   );

//   if (!page) {
//     throw new APIError(StatusCodes.NOT_FOUND, "Page not found");
//   }

//   return res.status(StatusCodes.OK).json({
//     message: "Page Section deleted successfully",
//     data: page,
//     success: true,
//   });
// };

export const deletePageController = async (req: Request, res: Response) => {
  const { name } = req.params;

  const page = await PageModel.findOneAndDelete({ name });

  if (!page) {
    throw new APIError(StatusCodes.NOT_FOUND, "Page not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Page deleted successfully",
    success: true,
  });
};
