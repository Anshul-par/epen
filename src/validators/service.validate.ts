import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const validateCreateService = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    hidden: Joi.boolean().optional(),
    files: Joi.array().optional(),
    icon_image: Joi.any().optional(),
  }),
};

export const validateUpdateService = {
  params: Joi.object()
    .keys({
      id: Joi.custom(Joi_ObjectId).required(),
    })
    .required(),
  body: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().allow("").optional(),
    hidden: Joi.boolean().optional(),
    files: Joi.array().optional(),
    icon_image: Joi.any().optional(),
  }).min(1),
};

export const validateCreateSubService = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    service: Joi.string().required(),
    files: Joi.array().optional(),
    icon_image: Joi.any().optional(),
    hidden: Joi.boolean().optional(),
  }),
};

export const validateUpdateSubService = {
  params: Joi.object()
    .keys({
      id: Joi.custom(Joi_ObjectId).required(),
    })
    .required(),
  body: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().allow("").optional(),
    service: Joi.string().optional(),
    files: Joi.array().optional(),
    icon_image: Joi.any().optional(),
    hidden: Joi.boolean().optional(),
  }).min(1),
};
