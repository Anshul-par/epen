import { StatusCodes } from "http-status-codes";
import { findUser, updateUser } from "../services/user.service";
import { Request } from "../types/request.types";
import { Response } from "express";
import { APIError } from "../errors/apiError";
import { comparePassword, hashPassword } from "../utility/hashPassword";
import { generateJWT, verifyJWT } from "../utility/genJWT";
import { sendEmail } from "../utility/sendMail";

export const getUserInfoController = async (req: Request, res: Response) => {
  const userId = req.authUser._id.toString();

  const user = await findUser({
    query: { _id: userId },
    populate: ["profileImage"],
  });

  // Remove password from user object
  delete user.password;

  return res.status(StatusCodes.OK).json({
    message: "User fetched successfully",
    data: user,
    success: true,
  });
};

export const updateUserController = async (req: Request, res: Response) => {
  const userId = req.authUser._id.toString();
  const payload = req.body;

  const user = await findUser({
    query: { _id: userId },
  });

  if (!user) {
    throw new APIError(StatusCodes.NOT_FOUND, "User not found");
  }

  const updatedUser = await updateUser({
    query: { _id: userId },
    update: payload,
  });

  return res.status(StatusCodes.OK).json({
    message: "User updated successfully",
    data: updatedUser,
    success: true,
  });
};

export const updateUserMailController = async (req: Request, res: Response) => {
  const userId = req.authUser._id.toString();
  const { email, password } = req.body;

  const user = await findUser({
    query: { _id: userId },
  });

  if (!user) {
    throw new APIError(StatusCodes.NOT_FOUND, "User not found");
  }

  const isMatch = comparePassword(password, user.password);

  if (!isMatch) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Invalid Password.");
  }

  const updatedUser = await updateUser({
    query: { _id: userId },
    update: { email },
  });

  return res.status(StatusCodes.OK).json({
    message: "User email updated successfully",
    data: updatedUser,
    success: true,
  });
};

export const sendPasswordResetMailController = async (
  req: Request,
  res: Response
) => {
  const userId = req.authUser._id.toString();
  const email = req.authUser.email;

  const jwtToken = generateJWT(
    { id: userId },
    {
      expiresIn: "1h",
    }
  );

  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: `
        <p>Hi ${req.authUser.firstName || "user"},</p>
        <p>Please click here to <a href="${
          process.env.SERVER_BASE_URL
        }/user/password-reset?token=${jwtToken}">reset</a> your password.</p>
      `,
  });

  return res.status(StatusCodes.OK).json({
    message: "Password reset link sent successfully",
    success: true,
  });
};

export const renderPasswordResetPageController = async (
  req: Request,
  res: Response
) => {
  const { token } = req.query;
  let decoded: any;

  if (!token) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Invalid Token");
  }

  try {
    decoded = verifyJWT(token as string);
  } catch (error) {
    res.render("linkExpired");
  }

  return res.render("resetForm", {
    token,
    error: "",
  });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token } = req.query;
  const { password, confirmPassword } = req.body;

  if (!token) {
    return res.render("failedReset", { error: "Invalid or missing token." });
  }

  if (password !== confirmPassword) {
    return res.render("resetForm", {
      token,
      error: "Passwords do not match.",
    });
  }

  let userId: string;

  try {
    const decoded = verifyJWT(token as string);
    userId = decoded.id;
  } catch (err) {
    return res.render("linkExpired");
  }

  try {
    const hashedPassword = hashPassword(password);
    await updateUser({
      query: { _id: userId },
      update: { password: hashedPassword },
    });
  } catch (err) {
    return res.render("failedReset");
  }

  return res.render("successfulReset");
};

export const verifyUserController = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Email is required");
  }

  const user = await findUser({
    query: { email },
  });

  if (!user) {
    throw new APIError(StatusCodes.BAD_REQUEST, "User does not exists.");
  }

  const jwtToken = generateJWT(
    { id: user._id },
    {
      expiresIn: "1h",
    }
  );

  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: `
        <p>Hi ${"user"},</p>
        <p>Please click here to <a href="${
          process.env.SERVER_BASE_URL
        }/user/password-reset?token=${jwtToken}">reset</a> your password.</p>
      `,
  });

  return res.status(StatusCodes.OK).json({
    message: "Password reset link sent successfully",
    success: true,
  });
};

export const updatePasswordController = async (req: Request, res: Response) => {
  const userId = req.authUser._id.toString();
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new APIError(StatusCodes.BAD_REQUEST, "All fields are required.");
  }

  if (newPassword !== confirmPassword) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Passwords do not match.");
  }

  const user = await findUser({
    query: { _id: userId },
  });

  if (!user) {
    throw new APIError(StatusCodes.NOT_FOUND, "User not found");
  }

  const isMatch = comparePassword(currentPassword, user.password);

  if (!isMatch) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Invalid Password.");
  }

  const hashedPassword = hashPassword(newPassword);

  await updateUser({
    query: { _id: userId },
    update: { password: hashedPassword },
  });

  return res.status(StatusCodes.OK).json({
    message: "Password updated successfully",
    success: true,
  });
};
