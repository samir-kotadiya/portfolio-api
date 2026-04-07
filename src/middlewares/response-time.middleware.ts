import type { Request, Response, NextFunction } from "express";
import { logger } from "../core/logger/logger.js";

export const responseTimeMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const start = Date.now();

    res.on("finish", () => {
        const time = Date.now() - start;
        logger.info(`${req.method} ${req.url} - ${time}ms`);
    });

    next();
};