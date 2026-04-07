import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  sharePrecision: Number(process.env.SHARE_PRECISION || 3),
};