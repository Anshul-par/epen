import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const ValidateContactForm = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    message: Joi.string().required(),
    files: Joi.array().optional(),
    icon_image: Joi.any().optional(),
  }),
};

export const ValidateUpdateContactForm = {
  params: Joi.object().keys({
    id: Joi.custom(Joi_ObjectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    message: Joi.string().optional(),
    files: Joi.array().optional(),
    icon_image: Joi.any().optional(),
  }),
};
