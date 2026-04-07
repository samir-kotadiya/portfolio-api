import { AppDataSource } from "../../../core/database/data-source.js";
import { BaseRepository } from "../../../core/repositories/base.repository.js";
import { Order } from "../entities/order.entity.js";

// /**
//  * Repository provides methods for db interaction and db abstraction so 
//  * for now we use typeORM in build repostory feature but we can add here new custom 
//  * methods as per our needs
//  * save()
//  * find()
//  * findOne()
//  * delete()
//  */

class OrderRepository extends BaseRepository<Order> {
    constructor() {
        // Pass the Order entity and your global DataSource to the base class
        super(Order, AppDataSource);
    }
    // add order specific methods
    async findBuyOrders() {

        return this.find({
            where: {
                orderType: 'BUY'
            }
        })
    }
};

// Export a singleton instance to use across your app
export const orderRepository = new OrderRepository();