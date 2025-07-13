import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { PowensService } from 'src/powens/powens.service';
@Injectable()
export class DetectionPaiementCron {
    constructor(
        private prisma: PrismaService,
        private detectionService: PowensService,
    ) { }

    @Cron(CronExpression.EVERY_10_MINUTES, { name: 'detectAllPaiements' })
    async detectAllPaiements() {
        console.log('🕒 [CRON] Détection paiements - Démarrage');

        const users = await this.prisma.user.findMany({
            where: {
                powensAuthToken: { not: null },
                powensConnectionId: { not: null },
            },
        });

        for (const user of users) {
            try {
                await this.detectionService.synchronizeConnection(user.id);
                await this.detectionService.detectAndStorePaiements(user.id);
                console.log(`✅ [CRON] Paiements vérifiés pour user ${user.email}`);
            } catch (err) {
                console.error(`❌ [CRON] Échec pour user ${user.email}`, err.message);
                // Tu peux aussi notifier un admin ici si nécessaire
            }
        }

        console.log('✅ [CRON] Détection paiements - Terminée');
    }
}
