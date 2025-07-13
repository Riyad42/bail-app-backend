import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const nouveauPaiement = await prisma.paiementLoyer.create({
        data: {
            mois: 6, // Juin
            annee: 2025,
            statut: 'en retard', // ou 'en cours', 'en retard'
            montant: 650,
            datePaiement: new Date('2025-06-10'), // facultatif
            bail: { connect: { id: 14 } },         // remplace avec un ID de bail existant
            locataire: { connect: { id: 3 } },    // remplace avec un ID de locataire existant
        },
    });

    console.log('Paiement inséré :', nouveauPaiement);
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
