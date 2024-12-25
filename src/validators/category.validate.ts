import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const validateCreateCategory = {
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      description: Joi.string().allow("").optional(),
      files: Joi.array().optional(),
      icon_image: Joi.any().optional(),
      hidden: Joi.boolean().optional(),
    })
    .required(),
};

export const validateUpdateCategory = {
  params: Joi.object().keys({
    id: Joi.custom(Joi_ObjectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      description: Joi.string().allow("").optional(),
      files: Joi.array().optional(),
      icon_image: Joi.any().optional(),
      hidden: Joi.boolean().optional(),
    })
    .min(1),
};
