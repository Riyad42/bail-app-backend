import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as dayjs from 'dayjs';
import { Prisma } from '@prisma/client';


const prisma = new PrismaClient();

@Injectable()
export class DashboardService {
    async getDashboardStats(userId: number) {
        const now = dayjs();
        const currentMonth = now.month() + 1;
        const currentYear = now.year();

        const locatairesActifs = await prisma.locataire.count({
            where: { userId, actif: true },
        });

        const bauxEnCours = await prisma.bail.count({
            where: {
                userId,
                actif: true,
                dateDebut: { lte: now.toDate() },
                dateFin: { gte: now.toDate() },
            },
        });

        const loyersEncaissesCeMois = await prisma.paiementLoyer.findMany({
            where: {
                locataire: { userId },
                mois: currentMonth,
                annee: currentYear,
                statut: { in: ['payé', 'incomplet', 'trop perçu'] },
            },
        });

        const totalLoyersEncaisses = loyersEncaissesCeMois.reduce((acc, p) => acc + p.montant, 0);

        // Variation fictive pour l'exemple
        const variation = Math.floor(Math.random() * 20) - 5;

        const bauxActifs = await prisma.bail.findMany({
            where: {
                userId,
                actif: true,
                dateDebut: { lte: now.toDate() },
                dateFin: { gte: now.toDate() },
            },
        });

        const totalLoyersDus = bauxActifs.reduce((acc, bail) => acc + bail.montant, 0);

        const paiementsEncaissesCeMois = await prisma.paiementLoyer.findMany({
            where: {
                locataire: { userId },
                mois: currentMonth,
                annee: currentYear,
                statut: 'payé',
            },
        });

        // 🧮 Calcule ce qu'il reste à encaisser
        const totalLoyersRestants = totalLoyersDus - totalLoyersEncaisses;


        const loyersMensuels: number[] = [];
        for (let m = 1; m <= 12; m++) {
            const paiements = await prisma.paiementLoyer.findMany({
                where: {
                    locataire: { userId },
                    annee: currentYear,
                    mois: m,
                    statut: 'payé',
                },
            });
            const total = paiements.reduce((acc, p) => acc + p.montant, 0);
            loyersMensuels.push(total);
        }

        const paiements = await prisma.paiementLoyer.findMany({
            where: {
                locataire: { userId },
                mois: currentMonth,
                annee: currentYear,
            },
            include: {
                locataire: true,
                bail: {
                    include: { bien: true },
                },
            },
        });

        const paiementsFormatted = paiements.map(p => ({
            locataire: `${p.locataire.prenom} ${p.locataire.nom}`,
            avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${p.locataire.prenom}`,
            email: p.locataire.email,
            logement: p.bail.bien.adresse,
            periode: `${dayjs().format('MMMM YYYY')} (${dayjs(p.createdAt).format('D MMM')})`,
            montant: p.montant,
            quittance: p.statut === 'payé' ? 'Prête' : 'En cours',
            etat: p.statut.charAt(0).toUpperCase() + p.statut.slice(1),
            fiabilite: p.locataire.fiabilite ?? 100
        }));



        return {
            locatairesActifs,
            bauxEnCours,
            loyersEncaissesCeMois: {
                total: totalLoyersEncaisses,
                variation,
            },
            loyersEnAttenteCeMois: totalLoyersRestants,
            loyersMensuels,
            paiements: paiementsFormatted,
        };
    }


    async getLoyersMensuels(year: number) {
        const loyersMensuelsPayes = Array(12).fill(0);
        const loyersMensuelsNonPayes = Array(12).fill(0);

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // de 1 à 12

        const baux = await prisma.bail.findMany({
            where: {
                actif: true,
                dateDebut: { lte: new Date(`${year}-12-31`) },
                dateFin: { gte: new Date(`${year}-01-01`) },
            },
            select: {
                id: true,
                montant: true,
                dateDebut: true,
                dateFin: true,
            },
        });

        const paiements = await prisma.paiementLoyer.findMany({
            where: {
                annee: year,
            },
            select: {
                mois: true,
                montant: true,
            },
        });

        // Étape 1 : sommer tous les paiements par mois (1-12)
        for (const paiement of paiements) {
            const monthIndex = paiement.mois - 1;

            // Ignore les mois futurs
            if (year === currentYear && paiement.mois > currentMonth) continue;

            if (monthIndex >= 0 && monthIndex < 12) {
                loyersMensuelsPayes[monthIndex] += paiement.montant;
            }
        }

        // Étape 2 : calculer le montant dû pour chaque mois depuis les baux actifs
        for (const bail of baux) {
            for (let month = 1; month <= 12; month++) {

                // Ignore les mois futurs
                if (year === currentYear && month > currentMonth) continue;

                const isInBailPeriod =
                    (!bail.dateDebut || bail.dateDebut <= new Date(year, month, 0)) &&
                    (!bail.dateFin || bail.dateFin >= new Date(year, month - 1, 1));

                if (isInBailPeriod) {
                    loyersMensuelsNonPayes[month - 1] += bail.montant;
                }
            }
        }

        // Étape 3 : transformer "non payés" en = dus - encaissés
        for (let i = 0; i < 12; i++) {
            // Ignore les mois futurs
            if (year === currentYear && i + 1 > currentMonth) continue;

            loyersMensuelsNonPayes[i] = Math.max(
                loyersMensuelsNonPayes[i] - loyersMensuelsPayes[i],
                0,
            );
        }

        const totalRecu = loyersMensuelsPayes.reduce((acc, val) => acc + val, 0);
        const totalNonPaye = loyersMensuelsNonPayes.reduce((acc, val) => acc + val, 0);

        return {
            loyersMensuelsPayes,
            loyersMensuelsNonPayes,
            totalRecu,
            totalNonPaye,
        };

    }


}