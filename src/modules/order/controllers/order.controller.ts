import type { Request, Response } from "express";
import { BaseController } from "../../../core/controllers/base.controller.js";
import { OrderService } from "../services/order.service.js";
import { CreateOrderDTO } from "../dto/create-order.dto.js";

export class OrderController extends BaseController {

    private service: OrderService;

    constructor() {
        super();
        this.service = new OrderService();
    }

    splitOrder = async (req: Request, res: Response) => {
        try {
            // validate request data
            const data = await this.validateDTO(CreateOrderDTO, req.body);

            // call split order service
            const result = await this.service.splitOrder(data);

            return this.ok(res, result);
        } catch (error) {
            return this.fail(res, error);
        }
    };

    getOrders = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            // call get orders service
            const orders = await this.service.getOrders(page, limit);

            return this.ok(res, orders);
        } catch (error) {
            return this.fail(res, error);
        }
    };
}