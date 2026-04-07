import type { Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export abstract class BaseController {

    protected async validateDTO<T>(dtoClass: new () => T, payload: unknown): Promise<T> {

        const dtoObject = plainToInstance(dtoClass, payload);

        const errors = await validate(dtoObject as object, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        
        if (errors.length > 0) {

            const formattedErrors = errors.map(err => ({
                field: err.property,
                errors: Object.values(err.constraints || {})
            }));
            throw {
                status: 400,
                message: "Validation failed",
                errors: formattedErrors
            };
        }

        return dtoObject;
    }

    protected ok(res: Response, data: unknown) {
        return res.status(200).json({
            success: true,
            data
        });
    }

    protected fail(res: Response, error: any) {

        const status = error.status || 500;

        return res.status(status).json({
            success: false,
            message: error.message || "Internal Server Error",
            errors: error.errors || []
        });
    }
};