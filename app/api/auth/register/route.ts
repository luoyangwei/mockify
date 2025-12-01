import { NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { User } from "@/lib/entity/user";
import { hashPassword } from "@/lib/auth";

/**
 * POST /api/auth/register - 用户注册
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, confirmPassword, description } = body;

        // 验证必填字段
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "姓名、邮箱和密码为必填项" },
                { status: 400 }
            );
        }

        // 验证密码确认
        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: "两次输入的密码不一致" },
                { status: 400 }
            );
        }

        // 验证密码长度
        if (password.length < 6) {
            return NextResponse.json(
                { error: "密码长度至少为 6 位" },
                { status: 400 }
            );
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "邮箱格式不正确" },
                { status: 400 }
            );
        }

        const userRepository = await getRepository(User);

        // 检查邮箱是否已存在
        const existingUser = await userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "该邮箱已被注册" },
                { status: 409 }
            );
        }

        // 创建新用户
        const hashedPassword = await hashPassword(password);
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        user.description = description || "";
        user.registeredAt = new Date();

        const savedUser = await userRepository.save(user);

        // 返回用户信息（不包含密码）
        const { password: _, ...userWithoutPassword } = savedUser;

        return NextResponse.json(
            {
                message: "注册成功",
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            { error: "注册失败，请稍后重试" },
            { status: 500 }
        );
    }
}

