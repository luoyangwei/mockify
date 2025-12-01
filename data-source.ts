import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./lib/entity/user";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: Number.parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_DBNAME || "mockify",
    entities: [User],
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV === "development",
    migrations: ["lib/migrations/**/*.ts"],
    subscribers: ["lib/subscribers/**/*.ts"],
});

