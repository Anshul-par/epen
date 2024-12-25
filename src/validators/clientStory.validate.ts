import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

const componentSchema = Joi.object({
  name: Joi.string().required(),
  bgImage: Joi.custom(Joi_ObjectId).allow("", null).optional(),
  image: Joi.custom(Joi_ObjectId).allow("", null).optional(),
  mainHeading: Joi.string().optional(),
  subHeading: Joi.string().optional(),
  CTA_text: Joi.string().optional(),
  order: Joi.number().optional(),
  others: Joi.any().optional(),
});

export const validateCreateClientStory = {
  body: Joi.object({
    client: Joi.custom(Joi_ObjectId).required(),
    icon_image: Joi.custom(Joi_ObjectId).allow("", null).optional(),
    components: Joi.array().items(componentSchema).optional(),
  }),
};
