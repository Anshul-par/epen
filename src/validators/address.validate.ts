import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const validateCreateAddress = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    companyName: Joi.string().allow(null, "").optional(),
    address: Joi.string().required(),
    addressLine2: Joi.string().allow(null, "").optional(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    region: Joi.string().allow(null, "").optional(),
    zip: Joi.string().pattern(/^\d+$/).required(),
    default: Joi.boolean().optional(),
    phone: Joi.string()
      .pattern(/^\+?[0-9\- ]+$/)
      .required(),
  }),
};

export const validateUpdateAddress = {
  params: Joi.object()
    .keys({
      id: Joi.custom(Joi_ObjectId).required(),
    })
    .required(),
  body: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    companyName: Joi.string().allow(null, "").optional(),
    address: Joi.string().optional(),
    addressLine2: Joi.string().allow(null, "").optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    default: Joi.boolean().optional(),
    region: Joi.string().allow(null, "").optional(),
    zip: Joi.string().pattern(/^\d+$/).optional(),
    phone: Joi.string()
      .pattern(/^\+?[0-9\- ]+$/)
      .optional(),
  }).min(1),
};
