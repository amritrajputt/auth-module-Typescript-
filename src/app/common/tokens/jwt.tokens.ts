import jwt from "jsonwebtoken";
import type { User } from "../../../db/schema.js";
import { randomBytes, createHmac } from "node:crypto";
import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";
import { eq } from "drizzle-orm";

const jwtSecret = process.env.JWT_SECRET as string;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET as string;

export interface TokenPayload {
    id: string;
    iat?: number;
    exp?: number;
}

export class Jwt {

    public static generateAccessToken(user: User) {
        return jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });
    }
    public static generateRefreshToken(user: User) {
        return jwt.sign({ id: user.id }, jwtRefreshSecret, { expiresIn: "7d" });
    }

    public static verifyToken(token: string) {
        return jwt.verify(token, jwtSecret) as TokenPayload;
    }
    public static verifyRefreshToken(token: string) {
        return jwt.verify(token, jwtRefreshSecret) as TokenPayload;
    }

    public static async generateResetToken(user: User) {
        const token = randomBytes(32).toString("hex");
        const hashedToken = createHmac('sha256', jwtSecret).update(token).digest('hex');
        const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await db.update(users).set({
            resetPasswordToken: hashedToken,
            resetPasswordTokenExpiry: tokenExpiry
        }).where(eq(users.id, user.id));
        return { rawToken: token, hashedToken: hashedToken };
    }

    public static async generateVerifyToken(user: User) {
        const token = randomBytes(32).toString("hex");
        const hashedToken = createHmac('sha256', jwtSecret).update(token).digest('hex');
        const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await db.update(users).set({
            verifyToken: hashedToken,
            verifyTokenExpiry: tokenExpiry
        }).where(eq(users.id, user.id));
        return { rawToken: token, hashedToken };
    }

}