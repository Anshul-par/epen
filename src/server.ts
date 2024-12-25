// CATCH ASYNC ERRORS IN EXPRESS WITHOUT USING TRY/CATCH BLOCK
require("express-async-errors");

// INTIALISE DOTENV
require("dotenv").config();

// INITIALISE FIREBASE
import { firebase } from "./utility/firebase";
firebase();

import cors from "cors";
import express from "express";
import { startServer } from "./utility/startServer";
import { rootRouter } from "./routes";
import { APIError } from "./errors/apiError";
import { StatusCodes } from "http-status-codes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import path from "path";

const app = express();
const port = Number(process.env.PORT) || 3001;

// VIEW ENGINE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// FOR LOGGING REQUESTS TO DEBUG
app.use((req, _, next) => {
  const info = req.method + " " + req.url;
  console.log("API HIT -------------->", info, "\n|\nv\n|\nv\n");
  next();
});

// FOR PARSING REQUEST BODY
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: "x-auth-token",
  })
);

// FOR ROUTES
app.use(rootRouter);

// FOR INVALID PATHS
app.all("*", (req, _) => {
  throw new APIError(
    StatusCodes.NOT_FOUND,
    `Requested URL ${req.path} not found`
  );
});

// CENTRAL ERROR MIDDLEWARE
app.use(errorMiddleware);

startServer(app, port);
