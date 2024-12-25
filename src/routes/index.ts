import express from "express";
import { StatusCodes } from "http-status-codes";
import { authRouter } from "./auth.route";
import { clientRouter } from "./client.route";
import { contactRouter } from "./contact.route";
import { productRouter } from "./product.route";
import { servicesRouter } from "./services.route";
import { faqRouter } from "./faq.route";
import { userRouter } from "./user.route";
import { addressRouter } from "./address.route";
import { categoryRouter } from "./category.route";
import { pageRouter } from "./page.route";
import { mediaRouter } from "./media.route";
import { clientStoryRouter } from "./clientStory.route";
import { aboutusRouter } from "./aboutus.route";
import { productDetailsRouter } from "./productDetails.route";
import { cartRouter } from "./cart.route";

const rootRouter = express.Router();

rootRouter.get("/heartbeat", (_, res) => {
  return res.status(StatusCodes.OK).json({ message: "API is up and running" });
});

rootRouter.use("/auth", authRouter);
rootRouter.use("/clients", clientRouter);
rootRouter.use("/category", categoryRouter);
rootRouter.use("/contacts", contactRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/services", servicesRouter);
rootRouter.use("/faqs", faqRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/address", addressRouter);
rootRouter.use("/pages", pageRouter);
rootRouter.use("/upload", mediaRouter);
rootRouter.use("/client-story", clientStoryRouter);
rootRouter.use("/about-us", aboutusRouter);
rootRouter.use("/product-details", productDetailsRouter);
rootRouter.use("/cart", cartRouter);

export { rootRouter };
