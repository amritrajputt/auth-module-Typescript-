import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import "dotenv/config"
import authRouter from "./auth/auth.routes.js"
import { ApiError } from "./common/errors/api.error.js";

export function createApplication(): Express {
    const app: Express = express();
    app.use(express.json());
    app.use('/api/auth', authRouter)

    // Global Error Handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ApiError) {
            res.status(err.statusCode).json({ success: false, message: err.message });
            return;
        }
        
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error", debug: err.message || err.toString(), stack: err.stack });
    });

    return app;
}