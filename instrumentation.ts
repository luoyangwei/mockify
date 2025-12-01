import "reflect-metadata";
import { initialize, close } from "./lib/db";

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        // 只在 Node.js 运行时初始化（服务器端）
        try {
            console.log("🚀 Initializing database connection...");
            await initialize();
            console.log("✅ Database connection initialized successfully");
        } catch (error) {
            console.error("❌ Failed to initialize database connection:", error);
            // 不抛出错误，让应用继续启动
            // 在实际使用时会再次尝试连接
        }

        // 注册应用关闭时的清理函数
        process.on("SIGTERM", async () => {
            console.log("🛑 SIGTERM received, closing database connection...");
            await close();
        });

        process.on("SIGINT", async () => {
            console.log("🛑 SIGINT received, closing database connection...");
            await close();
        });
    }
}

