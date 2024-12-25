import Joi from "joi";

export const validateUpdateUser = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.number().allow("", null).optional(),
  }).min(1),
};

export const validateUpdateUserMail = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).min(1),
};
