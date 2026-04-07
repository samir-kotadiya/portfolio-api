import express from "express";
import orderRoutes from "./modules/order/routes/index.js";
import { responseTimeMiddleware } from "./middlewares/response-time.middleware.js";
import { API_PREFIX, API_VERSION } from "./config/constants.js";

const app = express();

app.use(express.json());
app.use(responseTimeMiddleware);

app.use(`${API_PREFIX}/`, orderRoutes);

export default app;