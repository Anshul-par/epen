import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const validateCreateClient = {
  body: Joi.object({
    clientname: Joi.string().required(),
    projectTitle: Joi.string().required(),
    industry: Joi.string().required(),
    tags: Joi.string().required(),
    files: Joi.array().items().required(),
    hidden: Joi.boolean().optional(),
    icon_image: Joi.any().optional(),
  }),
};

export const validateUpdateClient = {
  params: Joi.object()
    .keys({
      id: Joi.custom(Joi_ObjectId).required(),
    })
    .required(),
  body: Joi.object({
    clientname: Joi.string().optional(),
    projectTitle: Joi.string().optional(),
    industry: Joi.string().optional(),
    tags: Joi.string().required().optional(),
    files: Joi.array().items().optional(),
    hidden: Joi.boolean().optional(),
    icon_image: Joi.any().optional(),
  }).min(1),
};
