import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js'; // Adjust the import path based on your app's entry point
import { AppDataSource } from '../../core/database/data-source.js';
import { mockGetOrdersServiceResponse } from '../data/get-orders-service-mock-response.js';
import { API_PREFIX } from '../../config/constants.js';

describe('Orders API', () => {

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  describe('POST /orders/split', () => {
    const orderPath = `${API_PREFIX}/v1/orders`
    it('should return 200 when order split successfully', async () => {

      const payload = {
        "orderType": "BUY",
        "totalAmount": 100,
        "portfolio": [
          {
            "symbol": "AAPL",
            "weight": 60
          },
          {
            "symbol": "TSLA",
            "weight": 40
          }
        ]
      };

      const response = await request(app).post(`${orderPath}/split`).send(payload).expect(200);

      // Add assertions based on expected response
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data'); // Assuming it returns new order IDs
    });

    it('should return 400 bad request error when order type is wrong', async () => {

      const payload = {
        "orderType": "test", // invalid type
        "totalAmount": 100,
        "portfolio": [
          {
            "symbol": "AAPL",
            "weight": 60
          },
          {
            "symbol": "TSLA",
            "weight": 40
          }
        ]
      };

      const response = await request(app).post(`${orderPath}/split`).send(payload).expect(400);

      // Add assertions based on expected response
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message'); // Assuming it returns new order IDs
    });

    it('should return 500 internal server error when an unexpected crash occurs', async () => {
      // import the service to spy on it
      const { OrderService } = await import('../../modules/order/services/order.service.js');

      // force the splitOrder method to throw a generic Error (not a 400 object)
      const spy = jest.spyOn(OrderService.prototype, 'splitOrder')
        .mockRejectedValueOnce(new Error("Database connection lost"));

      const payload = {
        "orderType": "BUY",
        "totalAmount": 100,
        "portfolio": [{ "symbol": "AAPL", "weight": 100 }]
      };

      const response = await request(app).post(`${orderPath}/split`).send(payload).expect(500);

      // assertions
      expect(response.body).toHaveProperty('success', false);
      // depending on your error handler, it might say "Internal Server Error"
      expect(response.body.message).toBeDefined();

      // clean up the spy so other tests aren't affected
      spy.mockRestore();
    });

  });

  describe('GET /orders', () => {
    const orderPath = `${API_PREFIX}/v1/orders`;
    it('should return 200 and data when order exist', async () => {

      // import the service to spy on it
      const { OrderService } = await import('../../modules/order/services/order.service.js');

      // force the getOrders method to throw a generic Error
      const spy = jest.spyOn(OrderService.prototype, 'getOrders')
        .mockResolvedValueOnce(mockGetOrdersServiceResponse as any);

      const response = await request(app).get(orderPath);

      // Add assertions based on expected response
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.data).toHaveLength(3);
    });

    it('should return 200 with empty orders when orders not available for page 2', async () => {
      const response = await request(app).get(`${orderPath}?page=2`).expect(200);

      // Add assertions based on expected response
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data'); // Assuming it returns new order IDs
      expect(response.body.data.data).toHaveLength(0);
      expect(response.body.data.data).toEqual([]);
    });

    it('should return 500 internal server error when an unexpected crash occurs', async () => {
      // import the service to spy on it
      const { OrderService } = await import('../../modules/order/services/order.service.js');

      // force the getOrders method to throw a generic Error
      const spy = jest.spyOn(OrderService.prototype, 'getOrders')
        .mockRejectedValueOnce(new Error("Database connection lost"));

      const response = await request(app).get(orderPath).expect(500);

      // assertions
      expect(response.body).toHaveProperty('success', false);
      // depending on your error handler, it might say "Internal Server Error"
      expect(response.body.message).toBeDefined();

      // clean up the spy so other tests aren't affected
      spy.mockRestore();
    });
  });
});