import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBailDto } from './dto/create-bail.dto';
import { UpdateBailDto } from './dto/update-bail.dto';

@Injectable()
export class BailService {
    constructor(private prisma: PrismaService) { }

    create(userId: number, data: CreateBailDto) {
        return this.prisma.bail.create({
            data: {
                ...data,
                userId,
                dateDebut: new Date(data.dateDebut),
                dateFin: new Date(data.dateFin),
            },
            include: {
                bien: true,
                locataire: true,
            },
        }).then(bail => {
            const now = new Date();
            return this.prisma.paiementLoyer.create({
                data: {
                    mois: now.getMonth() + 1,
                    annee: now.getFullYear(),
                    statut: 'en cours',
                    montant: bail.montant,
                    bailId: bail.id,
                    locataireId: bail.locataireId,
                },
            }).then(() => bail); // on renvoie le bail à la fin, après création du paiement
        });
    }




    findAll(userId: number) {
        return this.prisma.bail.findMany({
            where: { userId, actif: true },
            orderBy: { createdAt: 'desc' },
            include: {
                bien: true,
                locataire: true,
            },
        });
    }

    findOne(id: number, userId: number) {
        return this.prisma.bail.findFirst({
            where: { id, userId },
            include: {
                bien: true,
                locataire: true,
            },
        });
    }

    async attachFileToBail(id: number, filename: string) {
        return this.prisma.bail.update({
            where: { id },
            data: {
                documentUrl: filename,
            },
        });
    }



    async update(id: number, userId: number, data: UpdateBailDto) {
        const bail = await this.findOne(id, userId);
        if (!bail) throw new NotFoundException('Bail non trouvé');

        return this.prisma.bail.update({
            where: { id },
            data: {
                ...data,
                dateDebut: data.dateDebut ? new Date(data.dateDebut) : undefined,
                dateFin: data.dateFin ? new Date(data.dateFin) : undefined,
            },
        });
    }

    async remove(id: number, userId: number) {
        const bail = await this.findOne(id, userId);
        if (!bail) throw new NotFoundException('Bail non trouvé');

        return this.prisma.bail.update({
            where: { id },
            data: { actif: false },
        });
    }
}
