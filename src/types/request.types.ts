import { Request as ExpresesRequest } from "express";
import { IUser } from "./model.types";

export interface Request extends ExpresesRequest {
  authUser?: IUser;
  userId?: string;
  admin?: boolean;
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
