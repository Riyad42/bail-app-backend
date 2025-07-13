import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UpdateFiabiliteCron {
    private readonly logger = new Logger(UpdateFiabiliteCron.name);

    constructor(private readonly prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        const locataires = await this.prisma.locataire.findMany({
            where: { actif: true },
            include: {
                paiements: true,
            },
        });

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        for (const loc of locataires) {
            let score = 100;
            let retardStreak = 0;
            let impayeStreak = 0;
            let paiementPonctuelStreak = 0;

            // On trie les paiements par date (du plus ancien au plus récent)
            const paiements = loc.paiements.sort(
                (a, b) => a.annee - b.annee || a.mois - b.mois,
            );

            for (const paiement of paiements) {
                // Ignore les paiements futurs
                if (
                    paiement.annee > currentYear ||
                    (paiement.annee === currentYear && paiement.mois > currentMonth)
                ) {
                    continue;
                }

                const statut = paiement.statut;

                if (statut === 'payé') {
                    paiementPonctuelStreak++;
                    retardStreak = 0;
                    impayeStreak = 0;
                    score += 5 * paiementPonctuelStreak; // 5% puis 10% si affilé, etc.
                } else if (statut === 'retard') {
                    retardStreak++;
                    paiementPonctuelStreak = 0;
                    impayeStreak = 0;
                    score -= 5 * retardStreak; // -5%, -10%, etc.
                } else if (statut === 'incomplet') {
                    // On considère incomplet comme retard si payé, ou impayé si absent
                    if (paiement.datePaiement) {
                        retardStreak++;
                        paiementPonctuelStreak = 0;
                        impayeStreak = 0;
                        score -= 5 * retardStreak;
                    } else {
                        impayeStreak++;
                        paiementPonctuelStreak = 0;
                        retardStreak = 0;
                        score -= 10 * impayeStreak; // -10%, -20%, etc.
                    }
                } else if (statut === 'non payé') {
                    impayeStreak++;
                    paiementPonctuelStreak = 0;
                    retardStreak = 0;
                    score -= 10 * impayeStreak;
                } else if (statut === 'trop perçu') {
                    // considéré comme payé
                    paiementPonctuelStreak++;
                    retardStreak = 0;
                    impayeStreak = 0;
                    score += 5 * paiementPonctuelStreak;
                }
            }

            // Clamp entre 0 et 100
            const finalScore = Math.max(0, Math.min(100, score));

            await this.prisma.locataire.update({
                where: { id: loc.id },
                data: { fiabilite: Math.round(finalScore) },
            });
        }

        this.logger.log('Fiabilités mises à jour.');
    }
}
