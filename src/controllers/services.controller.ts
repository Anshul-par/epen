import { Response } from "express";
import { Request } from "../types/request.types";
import { StatusCodes } from "http-status-codes";
import {
  createServiceInDB,
  createSubServiceInDB,
  deleteServiceInDB,
  deleteSubServiceInDB,
  findServiceInDB,
  findSubServiceInDB,
  updateServiceInDB,
  updateSubServiceInDB,
} from "../services/service.service";
import { APIError } from "../errors/apiError";
import { saveMediaInDB, uploadMediaToS3 } from "../services/media.service";

export const createServiceController = async (req: Request, res: Response) => {
  const payload = req.body;

  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);
  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.image = media._id;
  }

  if (req.body.icon_image) {
    const file = req.body.icon_image as Express.Multer.File;
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "Icon Image",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.icon_image = media._id;
  }

  const service = await createServiceInDB({
    ...payload,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Service created successfully",
    data: service,
    success: true,
  });
};

export const createSubServiceController = async (
  req: Request,
  res: Response
) => {
  const payload = req.body;

  const doesServiceExist = await findServiceInDB({
    query: { _id: payload.service },
  });

  if (!doesServiceExist.length) {
    throw new APIError(
      StatusCodes.NOT_FOUND,
      "Service does not exist. Create service first."
    );
  }
  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);
  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.image = media._id;
  }

  if (req.body.icon_image) {
    const file = req.body.icon_image as Express.Multer.File;
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "Icon Image",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.icon_image = media._id;
  }
  const service = await createSubServiceInDB({
    ...payload,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Sub-Service created successfully",
    data: service,
    success: true,
  });
};

export const getServicesController = async (req: Request, res: Response) => {
  const isAdminRequested = req?.authUser?.role === "ADMIN";
  const services = await findServiceInDB({
    query: {
      ...(isAdminRequested ? {} : { hidden: false }),
    },
  });

  return res.status(StatusCodes.OK).json({
    message: "Services fetched successfully",
    data: services,
    success: true,
  });
};

export const getSingleServiceController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const service = await findServiceInDB({
    query: { _id: id },
  });

  if (!service.length) {
    throw new APIError(StatusCodes.NOT_FOUND, "Service not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Service fetched successfully",
    data: service[0],
    success: true,
  });
};

export const getSubServicesController = async (req: Request, res: Response) => {
  const isAdminRequested = req?.authUser?.role === "ADMIN";
  const services = await findSubServiceInDB({
    query: {
      ...(isAdminRequested ? {} : { hidden: false }),
    },
    populate: [
      { path: "service", select: "name" },
      { path: "image", select: "url" },
      { path: "icon_image", select: "url" },
    ],
  });

  return res.status(StatusCodes.OK).json({
    message: "Sub-Services fetched successfully",
    data: services,
    success: true,
  });
};

export const getSingleSubServicesController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const services = await findSubServiceInDB({
    query: { _id: id },
    populate: [
      { path: "service", select: "name" },
      { path: "image", select: "url" },
      { path: "icon_image", select: "url" },
    ],
  });

  if (!services) {
    throw new APIError(StatusCodes.NOT_FOUND, "Sub Service not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Sub-Services fetched successfully",
    data: services,
    success: true,
  });
};

export const updateServiceController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const service = await findServiceInDB({
    query: { _id: id },
  });

  if (!service) {
    throw new APIError(StatusCodes.NOT_FOUND, "Service not found");
  }

  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);
  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.image = media._id;
  }

  if (req.body.icon_image) {
    const file = req.body.icon_image as Express.Multer.File;
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "Icon Image",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.icon_image = media._id;
  }

  const updatedService = await updateServiceInDB({
    query: { _id: id },
    update: payload,
  });

  return res.status(StatusCodes.OK).json({
    message: "Service updated successfully",
    data: updatedService,
    success: true,
  });
};

export const updateSubServiceController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const payload = req.body;

  console.log("payload", payload);

  const service = await findSubServiceInDB({
    query: { _id: id },
  });

  if (!service) {
    throw new APIError(StatusCodes.NOT_FOUND, "Sub Service not found");
  }

  if (payload.service) {
    const doesServiceExist = await findServiceInDB({
      query: { _id: payload.service },
    });

    if (!doesServiceExist.length) {
      throw new APIError(
        StatusCodes.NOT_FOUND,
        "Service does not exist. Create service first."
      );
    }
  }

  const file = Array.isArray(req.files)
    ? req.files?.[0]
    : (req.files?.["file"]?.[0] as Express.Multer.File);
  if (file) {
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.image = media._id;
  }

  if (req.body.icon_image) {
    const file = req.body.icon_image as Express.Multer.File;
    const { _id, url } = await uploadMediaToS3(file.buffer, file.mimetype);
    const media = await saveMediaInDB({
      description: "Icon Image",
      mime: file.mimetype,
      title: file.originalname,
      url,
      _id,
    });

    payload.icon_image = media._id;
  }

  const updatedService = await updateSubServiceInDB({
    query: { _id: id },
    update: payload,
  });

  return res.status(StatusCodes.OK).json({
    message: "Sub Service updated successfully",
    data: updatedService,
    success: true,
  });
};

export const deleteServiceController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const service = await findServiceInDB({
    query: { _id: id },
  });

  if (!service) {
    throw new APIError(StatusCodes.NOT_FOUND, "Service not found");
  }

  const s = await deleteServiceInDB({
    query: { _id: id },
  });

  if (!s) {
    throw new APIError(StatusCodes.NOT_FOUND, "Service not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Service deleted successfully",
    success: true,
  });
};

export const deleteSubServiceController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const service = await findSubServiceInDB({
    query: { _id: id },
  });

  if (!service) {
    throw new APIError(StatusCodes.NOT_FOUND, "Service not found");
  }

  const s = await deleteSubServiceInDB({
    query: { _id: id },
  });

  if (!s) {
    throw new APIError(StatusCodes.NOT_FOUND, "Sub Service not found");
  }

  return res.status(StatusCodes.OK).json({
    message: "Service deleted successfully",
    success: true,
  });
};
