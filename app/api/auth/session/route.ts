import { NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";

/**
 * GET /api/auth/session - 获取当前 session（用于客户端）
 */
export async function GET() {
    try {
        const session = await getSession();
        return NextResponse.json(session);
    } catch (error) {
        console.error("Error fetching session:", error);
        return NextResponse.json(
            { error: "获取 session 失败" },
            { status: 500 }
        );
    }
}

