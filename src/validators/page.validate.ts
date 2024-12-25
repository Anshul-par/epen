import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const ComponentSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.custom(Joi_ObjectId).optional(),
  bgImage: Joi.custom(Joi_ObjectId).optional(),
  bgVideo: Joi.custom(Joi_ObjectId).optional(),
  mainHeading: Joi.string().required(),
  subHeading: Joi.string().allow(null, "").optional(),
  CTA_text: Joi.string().allow(null, "").optional(),
  order: Joi.number().optional(),
  others: Joi.any(),
});

export const validateCreatePage = {
  body: Joi.object({
    name: Joi.string().required(),
    components: Joi.array().items(ComponentSchema).required(),
  }),
};
