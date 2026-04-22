import { db } from "./dist/db/index.js";
import { users } from "./dist/db/schema.js";
import { eq } from "drizzle-orm";
import { randomBytes, createHmac } from "node:crypto";
import { ApiResponse } from "./dist/app/common/Responses/api.response.js";

async function run() {
  try {
    const email = "test@test.com";
    const password = "password123";
    const firstName = "John";
    const lastName = "Doe";

    console.log("Checking existing...");
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    console.log("Hashing...");
    const salt = randomBytes(32).toString('hex')
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex')

    console.log("Inserting...");
    const newUser = await db.insert(users).values({
        email,
        password: hashedPassword,
        salt,
        firstName,
        lastName,
    }).returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName
    });
    
    console.log("Response...");
    const resp = ApiResponse.created("User registered successfully", newUser[0]);
    console.log("Success!", resp);

  } catch (err) {
    console.error("Error exactly:", err);
  }
}
run();
