import joi from "joi";

export const validateCreateAboutUs = {
  body: joi.object({
    address: joi.string().min(12).required(),
    phone: joi.string().min(6).max(12).required(),
    aboutus: joi.string().min(6).required(),
  }),
};

export const validateUpdateAboutUs = {
  body: joi
    .object({
      address: joi.string().min(12).optional(),
      phone: joi.string().min(6).max(12).optional(),
      aboutus: joi.string().min(6).optional(),
    })
    .min(1),
};
