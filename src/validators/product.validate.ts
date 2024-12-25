import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const validateCreateVideoPlugin = {
  body: Joi.object({
    category: Joi.custom(Joi_ObjectId).required(),
    company_name: Joi.string().optional(),
    product_name: Joi.string().required(),
    description: Joi.string().optional(),
    heading_main: Joi.string().required(),
    heading_sub: Joi.string().optional(),
    key_features: Joi.array()
      .items(
        Joi.object({
          heading: Joi.string().required(),
          paragraph: Joi.string().required(),
        })
      )
      .required(),
    tags: Joi.array().items(Joi.string()).required(),
    supported_platforms: Joi.array().items(Joi.string()).optional(),
    supported_gpu_architectures: Joi.array()
      .items(Joi.string().allow(""))
      .min(0)
      .optional(),
    target_applications: Joi.array().items(Joi.string()).optional(),
    version: Joi.string().optional(),
    transformation_statement: Joi.string().optional(),
    hidden: Joi.boolean().optional(),
    files: Joi.array().items().min(0).optional(),
    icon_image: Joi.any().optional(),
  }),
};

export const validateUpdateVideoPlugin = {
  params: Joi.object()
    .keys({
      id: Joi.custom(Joi_ObjectId).required(),
    })
    .required(),
  body: Joi.object({
    category: Joi.custom(Joi_ObjectId).optional(),
    company_name: Joi.string().optional(),
    product_name: Joi.string().optional(),
    description: Joi.string().optional(),
    heading_main: Joi.string().optional(),
    heading_sub: Joi.string().optional(),
    key_features: Joi.array()
      .items(
        Joi.object({
          heading: Joi.string().required(),
          paragraph: Joi.string().required(),
        })
      )
      .optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    supported_platforms: Joi.array().items(Joi.string()).optional(),
    supported_gpu_architectures: Joi.array()
      .items(Joi.string().allow(""))
      .optional(),
    target_applications: Joi.array().items(Joi.string()).optional(),
    version: Joi.string().optional(),
    transformation_statement: Joi.string().optional(),
    hidden: Joi.boolean().optional(),
    files: Joi.array().items().min(0).optional(),
    icon_image: Joi.any().optional(),
  }).min(1),
};
