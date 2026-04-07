import { Router } from "express";
import v1Routes from "./v1/order.routes.js";

const router = Router();

router.use("/v1/orders", v1Routes);

export default router;