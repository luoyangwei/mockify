import { auth } from "@/lib/auth-config";

/**
 * 在服务器组件或 API 路由中获取当前 session
 * 使用 next-auth v5 的 auth() 函数
 */
export async function getSession() {
    return auth();
}

