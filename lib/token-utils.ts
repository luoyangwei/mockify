import { getRepository } from "./db";
import { User } from "./entity/user";
import { Token } from "./entity/token";
import { randomUUID } from "crypto";
import type { Repository } from "typeorm";

/**
 * 生成 32 位 UUID 格式的 token 字符串（去掉连字符）
 */
function generateTokenString(): string {
    return randomUUID().replace(/-/g, "");
}

/**
 * 确保用户有 token，如果没有则创建一个
 * @param userId 用户 ID
 * @returns Token 实体
 */
export async function ensureUserToken(userId: number): Promise<Token> {
    const tokenRepository = (await getRepository(Token)) as Repository<Token>;
    const userRepository = (await getRepository(User)) as Repository<User>;

    // 查找用户是否已有 token
    let token = await tokenRepository.findOne({
        where: { user: { id: userId } },
        relations: ["user"],
    });

    // 如果用户没有 token，创建一个新的
    if (!token) {
        const user = await userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("用户不存在");
        }

        token = tokenRepository.create({
            token: generateTokenString(),
            user: user,
            createdAt: new Date(),
        });

        await tokenRepository.save(token);
    }

    return token;
}

/**
 * 获取用户的 token
 * @param userId 用户 ID
 * @returns Token 实体或 null
 */
export async function getUserToken(userId: number): Promise<Token | null> {
    const tokenRepository = (await getRepository(Token)) as Repository<Token>;

    return await tokenRepository.findOne({
        where: { user: { id: userId } },
        relations: ["user"],
    });
}
