import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;

    if (!dbUrl) {
      throw new Error("DB_URL is not defined");
    }
    await mongoose.connect(dbUrl);
    console.log("--Connected to DB--");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
