import type { Request, Response, NextFunction } from "express";
import type { BaseDto } from "../dto/base.dto.js";
import { ApiError } from "../errors/api.error.js";

export const validate = (dto: typeof BaseDto) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, data } = dto.validate(req.body);
        if (error) {
            return next(ApiError.badRequest(error as string));
        }
        req.body = data;
        next();
    }
}