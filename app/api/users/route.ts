import { NextRequest, NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { User } from "@/lib/entity/user";

/**
 * GET /api/users - 获取所有用户
 */
export async function GET() {
    try {
        const userRepository = await getRepository(User);
        const users = await userRepository.find();
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/users - 创建新用户
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, description } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const userRepository = await getRepository(User);
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = password; // 注意：实际应用中应该加密密码
        user.description = description || "";
        user.registeredAt = new Date();

        const savedUser = await userRepository.save(user);
        return NextResponse.json({ user: savedUser }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        );
    }
}

