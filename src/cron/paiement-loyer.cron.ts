import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaiementLoyerCron {
    private readonly logger = new Logger(PaiementLoyerCron.name);

    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_HOUR)
    async createMonthlyPaiementsIfMissing() {
        const now = new Date();
        const mois = now.getMonth() + 1;
        const annee = now.getFullYear();

        // 🔍 Étape 1 : récupérer tous les paiements existants pour le mois en cours
        const paiementsExistants = await this.prisma.paiementLoyer.findMany({
            where: { mois, annee },
            select: { bailId: true },
        });

        const bailsDéjàTraités = new Set(paiementsExistants.map(p => p.bailId));

        // 🔍 Étape 2 : récupérer tous les baux actifs
        const baux = await this.prisma.bail.findMany({
            where: { actif: true },
            include: { locataire: true },
        });

        for (const bail of baux) {
            if (bailsDéjàTraités.has(bail.id)) {
                this.logger.log(`⏩ Paiement déjà existant pour bail ${bail.id}, on passe.`);
                continue;
            }

            await this.prisma.paiementLoyer.create({
                data: {
                    mois: mois,
                    annee: annee,
                    statut: 'en cours',
                    montant: 0, // ou bail.montant si tu préfères
                    bail: {
                        connect: { id: bail.id },
                    },
                    locataire: {
                        connect: { id: bail.locataireId },
                    },
                },
            });


            this.logger.log(`✅ Paiement créé pour bail ${bail.id} (${bail.locataire.nom})`);
        }

        this.logger.log(`🎯 Cron terminé : ${baux.length} baux vérifiés`);
    }
}
