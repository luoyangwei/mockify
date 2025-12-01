import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/logout - 用户登出
 */
export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("auth-token");

        return NextResponse.json(
            { message: "登出成功" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error logging out:", error);
        return NextResponse.json(
            { error: "登出失败" },
            { status: 500 }
        );
    }
}

