import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class portfolioDTO {
    @IsString()
    symbol!: string;

    @IsNumber()
    weight!: number;

    @IsNumber()
    @IsOptional()
    price?: number;
}

export class CreateOrderDTO {

    @IsEnum(["BUY", "SELL"])
    orderType!: "BUY" | "SELL";

    @IsNumber()
    totalAmount!: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => portfolioDTO)
    portfolio!: portfolioDTO[];

    @IsString()
    @IsOptional()
    idempotencyKey?: string;
}
