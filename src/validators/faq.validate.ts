import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const validateCreateFaq = {
  body: Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    category: Joi.string().required(),
    hidden: Joi.boolean().optional(),
  }),
};

export const validateUpdateFaq = {
  params: Joi.object()
    .keys({
      id: Joi.custom(Joi_ObjectId).required(),
    })
    .required(),
  body: Joi.object({
    question: Joi.string().optional(),
    answer: Joi.string().optional(),
    category: Joi.string().optional(),
    hidden: Joi.boolean().optional(),
  }).min(1),
};
