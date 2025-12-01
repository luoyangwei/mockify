import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRepository } from "@/lib/db";
import { User } from "@/lib/entity/user";
import { verifyPassword, generateToken } from "@/lib/auth";

/**
 * POST /api/auth/login - 用户登录
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 验证必填字段
        if (!email || !password) {
            return NextResponse.json(
                { error: "邮箱和密码为必填项" },
                { status: 400 }
            );
        }

        const userRepository = await getRepository(User);

        // 查找用户
        const user = await userRepository.findOne({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "邮箱或密码错误" },
                { status: 401 }
            );
        }

        // 验证密码
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "邮箱或密码错误" },
                { status: 401 }
            );
        }

        // 生成 token
        const token = generateToken(user.id, user.email);

        // 设置 cookie
        const cookieStore = await cookies();
        cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 天
        });

        // 返回用户信息（不包含密码）
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                message: "登录成功",
                user: userWithoutPassword,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error logging in user:", error);
        return NextResponse.json(
            { error: "登录失败，请稍后重试" },
            { status: 500 }
        );
    }
}

