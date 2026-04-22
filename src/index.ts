import { createServer } from "node:http";
import dotenv from "dotenv";
import { createApplication } from "./app/server.js";
dotenv.config();


async function  main() {
    try {
        const server = createServer(createApplication());
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

main();