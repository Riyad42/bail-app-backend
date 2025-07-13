import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { addDays, isSameDay } from 'date-fns';

@Injectable()
export class PaiementLoyerScheduler {
    private readonly logger = new Logger(PaiementLoyerScheduler.name);

    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async generateUpcomingPaiements() {
        this.logger.log('Début de la génération des paiements automatiques...');

        const baux = await this.prisma.bail.findMany({
            where: { actif: true },
            include: { locataire: true },
        });

        const today = new Date();

        for (const bail of baux) {
            if (!bail.paiementLe) continue;

            const paiementDate = new Date(today.getFullYear(), today.getMonth() + 1, bail.paiementLe);
            const triggerDate = addDays(paiementDate, -14);

            if (!isSameDay(today, triggerDate)) continue;

            const mois = paiementDate.getMonth() + 1;
            const annee = paiementDate.getFullYear();

            const alreadyExists = await this.prisma.paiementLoyer.findFirst({
                where: {
                    bailId: bail.id,
                    mois,
                    annee,
                },
            });

            if (alreadyExists) continue;

            await this.prisma.paiementLoyer.create({
                data: {
                    mois,
                    annee,
                    statut: 'en cours',
                    montant: bail.montant + (bail.chargesMensuelles || 0),
                    bailId: bail.id,
                    locataireId: bail.locataireId,
                },
            });

            this.logger.log(`Paiement créé pour le bail ${bail.id} - ${mois}/${annee}`);
        }
    }
}
