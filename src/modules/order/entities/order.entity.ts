import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("orders")
export class Order {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "symbol", type: "varchar", length: 5 })
    symbol!: string;

    @Column({ name: "orderType", type: "varchar", enum: ['BUY', 'SELL'] })
    orderType!: "BUY" | "SELL";

    @Column({ name: "amount", type: "decimal" })
    amount!: number;

    @Column({ name: "shares", type: "decimal" })
    shares!: number;

    @Column({ name: "price", type: "decimal" })
    price!: number;

    @Column({ name: "executionTime", type: "datetime" })
    executionTime!: Date;

    @CreateDateColumn({ name: "createAt", type: "datetime" })
    createdAt!: Date;
}