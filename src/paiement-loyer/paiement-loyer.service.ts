import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';


@Injectable()
export class PaiementLoyerService {
    constructor(private prisma: PrismaService) { }

    create(locataireId: number, dto: CreatePaiementDto) {
        return this.prisma.paiementLoyer.create({
            data: {
                ...dto,
                locataireId,
                datePaiement: dto.datePaiement ? new Date(dto.datePaiement) : undefined,
            },
        });
    }


    findAllForBail(bailId: number) {
        return this.prisma.paiementLoyer.findMany({
            where: { bailId },
            orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
        });
    }

    update(id: number, dto: UpdatePaiementDto) {
        const shouldSetDatePaiement = dto.statut === 'payé' && !dto.datePaiement;

        return this.prisma.paiementLoyer.update({
            where: { id },
            data: {
                ...dto,
                datePaiement: shouldSetDatePaiement ? new Date() : dto.datePaiement ? new Date(dto.datePaiement) : undefined,
            },
        });
    }

    remove(id: number) {
        return this.prisma.paiementLoyer.delete({ where: { id } });
    }

    findAllForLocataire(locataireId: number) {
        return this.prisma.paiementLoyer.findMany({
            where: { locataireId },
            orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
        });
    }

    async findAllForBailleur(bailleurId: number) {
        const baux = await this.prisma.bail.findMany({
            where: { userId: bailleurId },
            select: { id: true },
        });

        const bailIds = baux.map(b => b.id);

        return this.prisma.paiementLoyer.findMany({
            where: { bailId: { in: bailIds } },
            include: {
                locataire: true,
            },
            orderBy: [{ annee: 'desc' }, { mois: 'desc' }],
        });

    }


}
