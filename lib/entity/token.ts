import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

/**
 * 用户使用 API 访问的 Token
 */
@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token!: string;
    
    @OneToOne(() => User)
    @JoinColumn()
    user!: User;

    @Column()
    createdAt!: Date;
}
