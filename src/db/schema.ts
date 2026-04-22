import { pgTable, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    salt?: string;
    isVerified: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export const users = pgTable('users', {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 45 }).notNull(),
    lastName: varchar("last_name", { length: 45 }).notNull(),
    email: varchar("email", { length: 322 }).notNull().unique(),
    password: varchar("password", { length: 128 }).notNull(),
    salt: varchar("salt", { length: 128 }).notNull(),
    isVerified: boolean("is_verified").default(false),
    verifyToken: varchar("verify_token", { length: 255 }).unique(),
    verifyTokenExpiry: timestamp("verify_token_expiry"),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }).unique(),
    resetPasswordTokenExpiry: timestamp("reset_password_token_expiry"),
    refreshToken: varchar("refresh_token", { length: 255 }).unique(),
    refreshTokenExpiry: timestamp("refresh_token_expiry"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
})