import { getRepository } from "./db";
import { User } from "./entity/user";

/**
 * 用户相关的数据库操作工具函数
 */
export const userRepository = {
    /**
     * 根据邮箱查找用户
     */
    async findByEmail(email: string): Promise<User | null> {
        const repository = await getRepository(User);
        return repository.findOne({ where: { email } }) as Promise<User | null>;
    },

    /**
     * 根据 ID 查找用户
     */
    async findById(id: number): Promise<User | null> {
        const repository = await getRepository(User);
        return repository.findOne({ where: { id } }) as Promise<User | null>;
    },

    /**
     * 创建用户
     */
    async create(userData: {
        name: string;
        email: string;
        password: string;
        description?: string;
    }): Promise<User> {
        const repository = await getRepository(User);
        const user = new User();
        user.name = userData.name;
        user.email = userData.email;
        user.password = userData.password;
        user.description = userData.description || "";
        user.registeredAt = new Date();
        return repository.save(user);
    },

    /**
     * 更新用户
     */
    async update(id: number, updates: Partial<User>): Promise<User | null> {
        const repository = await getRepository(User);
        await repository.update(id, updates);
        return this.findById(id);
    },

    /**
     * 删除用户
     */
    async delete(id: number): Promise<boolean> {
        const repository = await getRepository(User);
        const result = await repository.delete(id);
        return (result.affected ?? 0) > 0;
    },
};

