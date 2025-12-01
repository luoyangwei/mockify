import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { Token } from "./entity/token";

// 全局数据源实例
let AppDataSource: DataSource | null = null;

/**
 * 获取或创建数据库连接
 * 在 Next.js 中，我们需要确保连接在每次请求时可用
 */
export async function getDataSource(): Promise<DataSource> {
    if (AppDataSource?.isInitialized) {
        return AppDataSource;
    }

    if (!AppDataSource) {
        AppDataSource = new DataSource({
            type: "postgres",
            host: process.env.DATABASE_HOST || "localhost",
            port: Number.parseInt(process.env.DATABASE_PORT || "5432"),
            username: process.env.DATABASE_USER || "postgres",
            password: process.env.DATABASE_PASSWORD || "postgres",
            database: process.env.DATABASE_DBNAME || "mockify",
            entities: [User, Token],
            synchronize: process.env.NODE_ENV !== "production",
            logging: process.env.NODE_ENV === "development",
        });
    }

    if (!AppDataSource.isInitialized) {
        try {
            await AppDataSource.initialize();
            console.log("Database connection initialized");
        } catch (error) {
            console.error("Error during Data Source initialization:", error);
            throw error;
        }
    }

    return AppDataSource;
}

/**
 * 初始化数据库连接
 */
export const initialize = async (): Promise<void> => {
    await getDataSource();
};

/**
 * 关闭数据库连接
 */
export const close = async (): Promise<void> => {
    if (AppDataSource?.isInitialized) {
        await AppDataSource.destroy();
        AppDataSource = null;
        console.log("Database connection closed");
    }
};

/**
 * 获取数据库仓库
 */
export async function getRepository<T>(entity: new () => T) {
    const dataSource = await getDataSource();
    return dataSource.getRepository(entity);
}
