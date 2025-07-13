import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLocataireDto } from './dto/create-locataire.dto';
import { UpdateLocataireDto } from './dto/update-locataire.dto';

@Injectable()
export class LocataireService {
    constructor(private prisma: PrismaService) { }

    create(userId: number, data: CreateLocataireDto) {
        return this.prisma.locataire.create({
            data: {
                ...data,
                dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : undefined,
                userId,
            },
        });
    }


    findAll(userId: number) {
        return this.prisma.locataire.findMany({
            where: { userId, actif: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    findOne(id: number, userId: number) {
        return this.prisma.locataire.findFirst({
            where: { id, userId },
        });
    }

    async update(id: number, userId: number, data: UpdateLocataireDto) {
        const loc = await this.findOne(id, userId);
        if (!loc) throw new NotFoundException('Locataire non trouvé');

        return this.prisma.locataire.update({
            where: { id },
            data,
        });
    }

    async remove(id: number, userId: number) {
        const loc = await this.findOne(id, userId);
        if (!loc) throw new NotFoundException('Locataire non trouvé');

        return this.prisma.locataire.update({
            where: { id },
            data: { actif: false },
        });
    }
}
