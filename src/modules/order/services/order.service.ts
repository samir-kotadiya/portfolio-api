import { orderRepository } from "../repositories/order.repository.js";
import { DEFAULT_STOCK_PRICE } from "../../../config/constants.js";
import { roundShares } from "../../../shared/utils/round.util.js";
import { getExecutionTime } from "../../../shared/utils/market-time.util.js";
import { Order } from "../entities/order.entity.js";
import { BaseService } from "../../../core/services/base.service.js";
import type { CreateOrderDTO, portfolioDTO } from "../dto/create-order.dto.js";
import config from "../../../config/config.js";

export class OrderService extends BaseService {

    private validatePortfolio(portfolio: portfolioDTO[]) {
        const symbols = new Set<string>();
        let totalWeight = 0;

        for (const stock of portfolio) {

            // duplicate symbol check
            if (symbols.has(stock.symbol)) {
                this.badRequest(`Duplicate stock found: ${stock.symbol}`);
            }

            symbols.add(stock.symbol);

            // price validation
            if (stock.price !== undefined && stock.price <= 0) {
                this.badRequest(`Price must be greater than 0 for stock ${stock.symbol}`);
            }

            totalWeight += stock.weight;
        }

        // weight validation
        if (totalWeight !== 100) {
            this.badRequest('Portfolio weights must sum to 100');
        }
    }

    async splitOrder(input: CreateOrderDTO) {

        const { totalAmount, portfolio, orderType } = input;

        // validate portfolio rules
        this.validatePortfolio(portfolio);

        const executionTime = getExecutionTime(new Date());
        
        const results: Order[] = [];

        for (const stock of portfolio) {
            // apply price rule
            const price = stock.price ?? DEFAULT_STOCK_PRICE;
            const amount = totalAmount * (stock.weight / 100);
            const shares = roundShares(amount / price, config.sharePrecision);

            if (shares <= 0) {
                this.badRequest(`Order too small for ${stock.symbol}`);
            }

            const order = orderRepository.create({
                symbol: stock.symbol,
                orderType,
                amount,
                shares,
                price,
                executionTime
            });
            await orderRepository.save(order);
            results.push(order);
        }

        return {
            executionTime,
            orders: results
        };
    }

    async getOrders(page: number, limit: number) {
        //return orderRepository.findBuyOrders();
        return orderRepository.paginated(page, limit);
    }
}