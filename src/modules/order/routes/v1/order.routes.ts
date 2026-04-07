import { Router } from "express";
import { OrderController } from "../../controllers/order.controller.js";

const router = Router();
const controller = new OrderController();

router.post("/split", controller.splitOrder);

router.get("/", controller.getOrders);

export default router;