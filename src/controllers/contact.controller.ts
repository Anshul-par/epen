import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { saveMediaInDB, uploadMediaToS3 } from "../services/media.service";
import {
  findContactService,
  saveContactToDB,
  updateContactToDB,
} from "../services/contact.service";

export const createContactController = async (req: Request, res: Response) => {
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
    payload.media = media._id;
  }

  const contact = await saveContactToDB({
    ...payload,
  });

  return res.status(StatusCodes.CREATED).json({
    message: "Contact created successfully",
    data: contact,
    success: true,
  });
};

export const getContactsController = async (req: Request, res: Response) => {
  const contacts = await findContactService({
    query: {},
  });
  return res.status(StatusCodes.OK).json({
    message: "Contacts fetched successfully",
    data: contacts,
    success: true,
  });
};

export const getSingleContactsController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const contacts = await findContactService({
    query: { _id: id },
    populate: ["media"],
  });
  return res.status(StatusCodes.OK).json({
    message: "Contacts fetched successfully",
    data: contacts,
    success: true,
  });
};

export const updateContactController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const contact = await updateContactToDB({
    update: { ...payload },
    query: { _id: id },
  });

  return res.status(StatusCodes.OK).json({
    message: "Contact updated successfully",
    data: contact,
    success: true,
  });
};
