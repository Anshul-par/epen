import { Request, Response } from "express";
import { Request as AuthRequest } from "../types/request.types";
import { createUser, findUser, updateUser } from "../services/user.service";
import { comparePassword, hashPassword } from "../utility/hashPassword";
import { StatusCodes } from "http-status-codes";
import { generateJWT } from "../utility/genJWT";
import { APIError } from "../errors/apiError";
import axios from "axios";
import { saveMediaInDB, uploadMediaToS3 } from "../services/media.service";
import { Types } from "mongoose";

export const adminAuthController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const adminUser = await findUser({
    query: { name: username, role: "ADMIN" },
  });

  if (!adminUser) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Invalid Username.");
  }

  const isMatch = comparePassword(password, adminUser.password);

  if (!isMatch) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Invalid Password.");
  }

  const token = generateJWT({ id: adminUser._id });

  res.setHeader("x-auth-token", token);

  return res.status(StatusCodes.OK).json({ message: "Login Successful" });
};

export const adminAuthSessionController = async (
  req: AuthRequest,
  res: Response
) => {
  const user_id = req.authUser._id.toString();
  const user = await findUser({
    query: { _id: user_id },
  });
  return res
    .status(StatusCodes.OK)
    .json({ message: "Admin Session Valid", user, success: true });
};

export const signUpAuthController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUser({
    query: { email },
    populate: ["profileImage"],
  });

  if (user) {
    throw new APIError(StatusCodes.BAD_REQUEST, "User already exists.");
  }

  const hashPass = hashPassword(password);

  const newUser = await createUser({
    email,
    password: hashPass,
  });

  const token = generateJWT({ id: newUser._id });

  res.setHeader("x-auth-token", token);

  return res.status(StatusCodes.CREATED).json({
    message: "User signed-up successfully",
    success: true,
    user: newUser,
  });
};

export const loginAuthController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUser({
    query: { email },
    populate: ["profileImage"],
  });

  if (!user) {
    throw new APIError(StatusCodes.BAD_REQUEST, "User does not exists.");
  }

  if (!comparePassword(password, user.password)) {
    throw new APIError(StatusCodes.BAD_REQUEST, "Invalid Password.");
  }

  const token = generateJWT({ id: user._id });

  res.setHeader("x-auth-token", token);

  return res.status(StatusCodes.OK).json({
    message: "User logged in successfully",
    success: true,
    user,
  });
};

const authenticateUserFromGoogle = async ({ token }: { token: string }) => {
  try {
    const { data } = await axios.get(`${process.env.GOOGLE_LOGIN}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Error while authenticate user with google", error);
    throw new APIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const googleLoginController = async (req: Request, res: Response) => {
  const access_token = req.headers["google-id-token"] as string;

  if (!access_token) {
    throw new APIError(
      StatusCodes.UNAUTHORIZED,
      "Unauthorized request. No token provided."
    );
  }

  let user;
  const data = await authenticateUserFromGoogle({ token: access_token });

  console.log("Google Data", data);

  if (data.email_verified) {
    user = await findUser({ query: { email: data.email } });
    if (!user) {
      user = await createUser({
        firstName: `${data.given_name}`,
        lastName: `${data.family_name}`,
        email: data.email,
        isGoogleLogin: true,
      });
    }

    if (data.picture) {
      const response = await axios.get(data.picture, {
        responseType: "arraybuffer",
      });
      const profileImage = await uploadMediaToS3(response.data, "image/png");
      const img = await saveMediaInDB({
        url: profileImage.url,
        title: "Profile Image",
        description: "Profile Image",
        mime: "image/png",
      });
      await updateUser({
        query: { _id: user._id.toString() },
        update: { profileImage: new Types.ObjectId(img._id) },
      });
    }
  } else {
    throw new APIError(
      StatusCodes.UNAUTHORIZED,
      "Unauthorized request. Email is not verified with Google. Please verify Email with Google."
    );
  }

  const token = generateJWT({ id: user._id.toString() });

  res
    .status(StatusCodes.OK)
    .set({ "x-auth-token": token })
    .json({ message: "User logged in successfully", success: true });
};
