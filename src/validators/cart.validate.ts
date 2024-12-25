import Joi from "joi";
import { Joi_ObjectId } from "./custom.validate";

export const validate_create_cart = {
  body: Joi.object({
    user: Joi.string().custom(Joi_ObjectId).required(),
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().custom(Joi_ObjectId).required(),
        quantity: Joi.number().default(1).optional(),
      })
    ),
  }),
};

export const validate_add_item = {
  body: Joi.object({
    cart: Joi.string().custom(Joi_ObjectId).required(),
    quantity: Joi.number().default(1).optional(),
    productId: Joi.string().custom(Joi_ObjectId).required(),
  }),
};

export const validate_remove_item = {
  body: Joi.object({
    cart: Joi.string().custom(Joi_ObjectId).required(),
    productId: Joi.string().custom(Joi_ObjectId).required(),
  }),
};
