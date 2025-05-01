import { Exclude, Expose } from 'class-transformer';
import { User as PrismaUser } from '@prisma/client';

@Exclude()
export class UserOutputDTO {
    @Expose() id: number;
    @Expose() name: string;
    @Expose() email: string;
    @Expose() createdAt: Date;
    @Expose() updatedAt: Date;

    constructor(user: PrismaUser) {
        Object.assign(this, user);
    }
}