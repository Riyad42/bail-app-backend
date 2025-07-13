import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';

@Injectable()
export class BienService {
    constructor(private prisma: PrismaService) { }

    create(userId: number, data: CreateBienDto) {
        return this.prisma.bien.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    findAll(userId: number) {
        return this.prisma.bien.findMany({
            where: { userId, actif: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    findOne(id: number, userId: number) {
        return this.prisma.bien.findFirst({
            where: { id, userId },
        });
    }

    async update(id: number, userId: number, data: UpdateBienDto) {
        const bien = await this.findOne(id, userId);
        if (!bien) throw new NotFoundException('Bien non trouvé');

        return this.prisma.bien.update({
            where: { id },
            data,
        });
    }

    async remove(id: number, userId: number) {
        const bien = await this.findOne(id, userId);
        if (!bien) throw new NotFoundException('Bien non trouvé');

        return this.prisma.bien.update({
            where: { id },
            data: { actif: false },
        });
    }
}
