import "reflect-metadata";
import { DataSource } from "typeorm";
import { Order } from "../../modules/order/entities/order.entity.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  //logging: true, // should be false on production
  entities: [Order],
});