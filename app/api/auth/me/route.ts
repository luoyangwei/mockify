import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepository } from "@/lib/db";
import { User } from "@/lib/entity/user";
import { verifyToken } from "@/lib/auth";

/**
 * GET /api/auth/me - 获取当前登录用户信息
 */
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "未登录" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { error: "无效的 token" },
                { status: 401 }
            );
        }

        const userRepository = await getRepository(User);
        const user = await userRepository.findOne({
            where: { id: decoded.userId },
        });

        if (!user) {
            return NextResponse.json(
                { error: "用户不存在" },
                { status: 404 }
            );
        }

        // 返回用户信息（不包含密码）
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            { user: userWithoutPassword },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "获取用户信息失败" },
            { status: 500 }
        );
    }
}

