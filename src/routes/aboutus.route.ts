import express from "express";
import { AboutUsModel } from "../models/aboutus.model";
import { StatusCodes } from "http-status-codes";
import { validateJWT } from "../middlewares/validateJWT";
import { validateIsAdmin } from "../middlewares/validateAdmin";
import { validateReqSchema } from "../middlewares/validateReqSchema";
import {
  validateCreateAboutUs,
  validateUpdateAboutUs,
} from "../validators/aboutus.validate";

const aboutusRouter = express.Router();

aboutusRouter.get("/", async (_, res) => {
  const data = await AboutUsModel.find();

  return res.json({
    message: "About Us fetched successfully",
    data,
    success: true,
  });
});

aboutusRouter.post(
  "/",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(validateCreateAboutUs),
  async (req, res) => {
    const payload = req.body;

    const data = await AboutUsModel.create({
      ...payload,
    });

    return res.json({
      message: "About Us created successfully",
      data,
      success: true,
    });
  }
);

aboutusRouter.patch(
  "/:id",
  validateJWT({}),
  validateIsAdmin,
  validateReqSchema(validateUpdateAboutUs),
  async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const aboutusData = await AboutUsModel.findByIdAndUpdate(
      id,
      {
        ...payload,
      },
      {
        new: true,
      }
    ).lean();

    if (!aboutusData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "About Us not found",
        success: false,
      });
    }

    return res.json({
      message: "About Us updated successfully",
      data: aboutusData,
      success: true,
    });
  }
);

export { aboutusRouter };
