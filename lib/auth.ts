import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * 加密密码
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * 验证密码
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * 生成 JWT token
 */
export function generateToken(userId: number, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, {
        expiresIn: "7d",
    });
}

/**
 * 验证 JWT token
 */
export function verifyToken(token: string): { userId: number; email: string } | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: number;
            email: string;
        };
        return decoded;
    } catch (error) {
        return null;
    }
}

