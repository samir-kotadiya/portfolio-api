import { jest } from '@jest/globals';
import { AppDataSource } from "../../../../core/database/data-source.js";
import type { CreateOrderDTO } from "../../../../modules/order/dto/create-order.dto.js";
import { OrderService } from "../../../../modules/order/services/order.service.js";

describe("Order Service", () => {

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      // remove test data
    }
  });

  describe("Split Order Service", () => {
    it("should split order correctly", async () => {

      const service = new OrderService();

      const result = await service.splitOrder({
        orderType: "BUY",
        totalAmount: 100,
        portfolio: [
          { symbol: "AAPL", weight: 60 },
          { symbol: "TSLA", weight: 40 }
        ]
      });

      expect(result.orders.length).toBe(2);
      expect(result.orders[0].amount).toBe(60)
      //expect(result.orders[0].shares).toBe(0.6);
    });

    it("should throw error when weight sum is exceeded 100%", async () => {
      const service = new OrderService();

      const orderData = {
        orderType: "BUY",
        totalAmount: 100,
        portfolio: [
          { symbol: "AAPL", weight: 60 },
          { symbol: "TSLA", weight: 50 }
        ]
      } as CreateOrderDTO;

      // Use .rejects to catch the error from the promise
      await expect(service.splitOrder(orderData)).rejects.toMatchObject({
        status: 400,
        message: 'Portfolio weights must sum to 100'
      });
    });

    it("should throw error when weight price is provided as zero", async () => {
      const service = new OrderService();

      const orderData = {
        orderType: "BUY",
        totalAmount: 100,
        portfolio: [
          { symbol: "AAPL", weight: 60, price: 0 },
          { symbol: "TSLA", weight: 40 }
        ]
      } as CreateOrderDTO;

      // Use .rejects to catch the error from the promise
      await expect(service.splitOrder(orderData)).rejects.toMatchObject({
        status: 400,
        message: 'Price must be greater than 0 for stock AAPL'
      });
    });

    it("should throw error when duplicate stock provided", async () => {
      const service = new OrderService();
      const orderData = {
        orderType: "BUY",
        totalAmount: 100,
        portfolio: [
          { symbol: "AAPL", weight: 60 },
          { symbol: "AAPL", weight: 20 },
          { symbol: "TSLA", weight: 20 }
        ]
      } as CreateOrderDTO;

      // Better than try/catch: cleaner and handles async correctly
      await expect(service.splitOrder(orderData)).rejects.toMatchObject({
        status: 400,
        message: expect.stringContaining("Duplicate stock found: AAPL")
      });
    });

    it("should schedule execution for Monday if ordered on Saturday", async () => {
      // Mock date to a Saturday (e.g., 2026-04-11)
      jest.useFakeTimers().setSystemTime(new Date('2026-04-11').getTime());

      const service = new OrderService();

      const result = await service.splitOrder({
        orderType: "BUY",
        totalAmount: 100,
        portfolio: [
          { symbol: "AAPL", weight: 60 },
          { symbol: "TSLA", weight: 40 }
        ]
      });

      // Assert the execution date is the following Monday (2023-10-09)
      const execDate = new Date(result.executionTime);
      expect(execDate.getDay()).toBe(1); // 1 = Monday

      jest.useRealTimers();
    });


    it("should respect configurable decimal precision (e.g., 3 places)", async () => {
       // 1. Clear the cache
      jest.resetModules()
      // Mock your config/env to 3 decimal places
      process.env.SHARE_PRECISION = "4";
      const service = new OrderService();

      const result = await service.splitOrder({
        orderType: "BUY",
        totalAmount: 100,
        portfolio: [
          { symbol: "AAPL", weight: 33.3333333 },
          { symbol: "TSLA", weight: 33.3333333 },
          { symbol: "GOOG", weight: 33.3333334 } // Precisely 100
        ]
      });
      //console.log(result)
      // Example: If price is $100, $33.333 is 0.33333 shares. 
      // With 3 decimals, it should be 0.333
      const aaplOrder = result.orders.find(o => o.symbol === "AAPL");
      const quantityStr = aaplOrder?.shares.toString().split('.')[1] || "";
      expect(quantityStr.length).toBeLessThanOrEqual(3);
    });
  });
});