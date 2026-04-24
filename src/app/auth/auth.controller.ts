import type { Request, Response, NextFunction } from "express";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { ApiError } from "../common/errors/api.error.js";
import { randomBytes, createHmac } from "node:crypto";
import { ApiResponse } from "../common/Responses/api.response.js";
import { Jwt } from "../common/tokens/jwt.tokens.js";
import type { User } from "../../db/schema.js";
import { sendVerificationEmail } from "../common/utils/email.js";

export class AuthController {
    private hashToken = (token: string) => {
        return createHmac('sha256', process.env.JWT_SECRET!).update(token).digest('hex');
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // req.body is already validated and safe to use!
            const { email, password, firstName, lastName } = req.body;
            const existingUser = await db.select().from(users).where(eq(users.email, email))
            if (existingUser.length > 0) {
                return next(ApiError.conflict("User already exists"));
            }
            const salt = randomBytes(32).toString('hex')
            const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')

            const [insertedUser] = await db.insert(users).values({
                email,
                password: hashedPassword,
                salt,
                firstName,
                lastName,
            }).returning();

            if (!insertedUser) {
                return next(ApiError.serverError("Failed to create user"));
            }

            const { rawToken, hashedToken } = await Jwt.generateVerifyToken(insertedUser as User);

            try {
                // Send the RAW token, not the database column which is empty at this point
                await sendVerificationEmail(email, rawToken);
            } catch (error) {
                console.log("Failed to send verification email:", error);
            }

            const safeUser = {
                id: insertedUser.id,
                email: insertedUser.email,
                firstName: insertedUser.firstName,
                lastName: insertedUser.lastName,
                verificationToken: rawToken
            };

            res.status(201).json(ApiResponse.created("User registered successfully", safeUser));
        } catch (error) {
            next(error);
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        // req.body is already validated and safe to use!
        const { email, password } = req.body;

        try {
            const [existingUser] = await db.select().from(users).where(eq(users.email, email));
            if (!existingUser) {
                return next(ApiError.notFound("User not found"));
            }
            const hashedPassword = createHmac('sha256', existingUser.salt!).update(password).digest('hex');
            if (hashedPassword !== existingUser.password) {
                return next(ApiError.unAuthorized("Invalid password"));
            }
            const accessToken = await Jwt.generateAccessToken(existingUser);
            const refreshToken = await Jwt.generateRefreshToken(existingUser);


            await db.update(users).set({
                refreshToken: this.hashToken(refreshToken),
                refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }).where(eq(users.id, existingUser.id));
            res.status(200).json(ApiResponse.ok("User logged in successfully", { accessToken, refreshToken }));
        } catch (error) {
            next(error);
        }
    }

    public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.body;

            // Hash the incoming raw token to find the match in our database
            const hashedToken = this.hashToken(token);

            const [existingUser] = await db.select().from(users).where(eq(users.verifyToken, hashedToken));

            if (!existingUser) {
                return next(ApiError.notFound("Invalid or expired verification token"));
            }

            // Check if the token has expired
            if (existingUser.verifyTokenExpiry && existingUser.verifyTokenExpiry < new Date()) {
                return next(ApiError.unAuthorized("Verification token has expired"));
            }

            // Mark user as verified and clear the token fields
            await db.update(users).set({
                isVerified: true,
                verifyToken: null,
                verifyTokenExpiry: null
            }).where(eq(users.id, existingUser.id));
            res.status(200).json(ApiResponse.success("Email verified successfully",200, null));
        } catch (error) {
            next(error);
        }
    }

    //generate new access token using the refresh token   
    public refreshAccessToken = async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const token = req.body.refreshToken;
            const decodedToken = Jwt.verifyRefreshToken(token);
            if(!decodedToken){
                return next(ApiError.unAuthorized("Invalid or expired refresh token"));
            }
            const [existingUser] = await db.select().from(users).where(eq(users.id, decodedToken.id));
            if(!existingUser){
                return next(ApiError.notFound("User not found"));
            }
            const accessToken = await Jwt.generateAccessToken(existingUser);
            const refreshToken = await Jwt.generateRefreshToken(existingUser);
            await db.update(users).set({
                refreshToken: this.hashToken(refreshToken),
                refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }).where(eq(users.id, existingUser.id));
            res.status(200).json(ApiResponse.ok("User logged in successfully", { accessToken, refreshToken }));
        }catch(error){
            next(error);
            
        }
    }
}


