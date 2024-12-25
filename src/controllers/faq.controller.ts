import { Response } from "express";
import { Request } from "../types/request.types";
import {
  createFAQInDB,
  deleteFAQInDB,
  findFAQInDB,
  updateFAQInDB,
} from "../services/faq.service";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../errors/apiError";

export const createFAQController = async (req: Request, res: Response) => {
  const payload = req.body;

  const faq = await createFAQInDB({
    ...payload,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "FAQ created successfully",
    data: faq,
    success: true,
  });
};

export const getFAQsController = async (req: Request, res: Response) => {
  const isAdminRequested = req?.authUser?.role === "ADMIN";
  const faqs = await findFAQInDB({
    query: {
      ...(isAdminRequested ? {} : { hidden: false }),
    },
  });

  return res.status(StatusCodes.OK).json({
    message: "FAQs fetched successfully",
    data: {
      categories: faqs.reduce((acc, curr) => {
        if (!acc.includes(curr.category)) {
          acc.push(curr.category);
        }
        return acc;
      }, []),
      faqs,
    },
    success: true,
  });
};

export const getSingleFAQController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const faq = await findFAQInDB({
    query: { _id: id },
  });

  if (!faq.length) {
    throw new APIError(StatusCodes.NOT_FOUND, "FAQ not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "FAQ fetched successfully",
    data: faq,
    success: true,
  });
};

export const updateFAQController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const faq = await updateFAQInDB({
    query: { _id: id },
    update: {
      ...payload,
    },
  });

  return res.status(StatusCodes.OK).json({
    message: "FAQ updated successfully",
    data: faq,
    success: true,
  });
};

export const deleteFAQController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const faq = await deleteFAQInDB({
    query: { _id: id },
  });

  return res.status(StatusCodes.OK).json({
    message: "FAQ deleted successfully",
    data: faq,
    success: true,
  });
};
