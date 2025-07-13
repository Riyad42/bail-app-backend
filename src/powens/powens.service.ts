import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class PowensService {
    private readonly apiUrl = 'https://gloomies-sandbox.biapi.pro/2.0/';

    constructor(private readonly prisma: PrismaService, private readonly http: HttpService) { }

    async createAuthTokenForUser(userId: number) {
        try {
            const res = await axios.post(`${this.apiUrl}/auth/init`, {
                client_id: process.env.POWENS_CLIENT_ID,
                client_secret: process.env.POWENS_CLIENT_SECRET,
            });

            const authToken = res.data.auth_token;

            if (!authToken) throw new Error("auth_token manquant");

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    powensAuthToken: authToken,
                },
            });

            return authToken;
        } catch (err) {
            console.error('Erreur Powens createAuthTokenForUser:', err?.response?.data || err);
            throw new InternalServerErrorException('Erreur lors de l’initialisation Powens');
        }
    }


    async generateTemporaryCode(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.powensAuthToken) throw new Error('Token Powens non trouvé');

        try {
            const callbackUrl = encodeURIComponent('http://localhost:4200/bank-success');
            const res = await axios.get(`${this.apiUrl}/auth/token/code?callback_url=${callbackUrl}`, {
                headers: { Authorization: `Bearer ${user.powensAuthToken}` },
            });
            return res.data.code;
        } catch (err) {
            console.error('Erreur Powens code temporaire:', err?.response?.data || err);
            throw new InternalServerErrorException('Erreur lors de la génération du code temporaire Powens');
        }
    }

    async storeConnectionId(userId: number, connectionId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { powensConnectionId: connectionId },
        });
    }

    async getUserAccounts(userId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.powensAuthToken) throw new Error('Token Powens manquant pour cet utilisateur');

        const response = await axios.get(`${this.apiUrl}/users/me/accounts`, {
            headers: {
                Authorization: `Bearer ${user.powensAuthToken}`,
            },
        });

        return response.data.accounts;
    }

    async synchronizeConnection(userId: number): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.powensAuthToken || !user?.powensConnectionId) {
            throw new Error("Accès impossible, token ou connection manquant");
        }

        try {
            const resp = await axios.put(
                `${this.apiUrl}/users/me/connections/${user.powensConnectionId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.powensAuthToken}`,
                    },
                }
            );
            return resp.data;
        } catch (err) {
            console.error("Erreur sync Powens :", err.response?.data || err);
            throw new InternalServerErrorException("Synchronisation échouée");
        }
    }



    private normalizeString(str: string): string {
        return str
            .normalize('NFD') // décompose accents
            .replace(/[\u0300-\u036f]/g, '') // supprime accents
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ''); // supprime espaces et ponctuation
    }

    async detectAndStorePaiements(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { locataires: true },
        });

        if (!user?.powensAuthToken || !user.powensConnectionId) {
            throw new Error('Utilisateur ou données Powens manquantes');
        }

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const fromDate = new Date(currentYear, currentMonth - 1, 1); // Premier jour du mois
        const toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59); // Fin aujourd'hui

        const from = fromDate.toISOString().split('T')[0];
        const to = toDate.toISOString().split('T')[0];

        const response = await axios.get(
            `${this.apiUrl}/users/me/transactions?limit=100&from_date=${from}&to_date=${to}`,
            {
                headers: {
                    Authorization: `Bearer ${user.powensAuthToken}`,
                },
            }
        );

        const transactions = response.data.transactions || [];

        for (const transaction of transactions) {
            const transactionDate = new Date(transaction.date);

            // ⚠️ Filtre strict : transaction doit être dans le mois en cours
            if (transactionDate < fromDate || transactionDate > toDate) continue;

            const label = this.normalizeString(transaction.wording ?? '');
            const webid = transaction.webid;

            if (!webid) continue;

            for (const loc of user.locataires) {
                const nom = this.normalizeString(loc.nom);
                const prenom = this.normalizeString(loc.prenom);

                const existingTx = await this.prisma.transactionDetectee.findUnique({
                    where: { webid },
                });
                if (existingTx) continue;

                if (label.includes(nom) && label.includes(prenom)) {
                    const bail = await this.prisma.bail.findFirst({
                        where: {
                            locataireId: loc.id,
                            actif: true,
                        },
                    });

                    if (!bail) {
                        console.warn(`⚠️ Aucun bail actif trouvé pour ${prenom} ${nom}`);
                        continue;
                    }

                    const montantLoyer = bail.montant;
                    const existingPaiement = await this.prisma.paiementLoyer.findFirst({
                        where: {
                            locataireId: loc.id,
                            mois: currentMonth,
                            annee: currentYear,
                        },
                    });

                    let montantTotal = transaction.value;
                    let statut: string;

                    if (existingPaiement) {
                        montantTotal += existingPaiement.montant;
                    }

                    if (montantTotal === montantLoyer) statut = 'payé';
                    else if (montantTotal < montantLoyer) statut = 'incomplet';
                    else statut = 'trop perçu';

                    if (existingPaiement) {
                        await this.prisma.paiementLoyer.update({
                            where: { id: existingPaiement.id },
                            data: {
                                montant: montantTotal,
                                datePaiement: transactionDate,
                                statut,
                            },
                        });
                    } else {
                        await this.prisma.paiementLoyer.create({
                            data: {
                                locataireId: loc.id,
                                bailId: bail.id,
                                montant: montantTotal,
                                mois: currentMonth,
                                annee: currentYear,
                                datePaiement: transactionDate,
                                statut,
                            },
                        });
                    }

                    await this.prisma.transactionDetectee.create({
                        data: {
                            webid,
                            locataireId: loc.id,
                            mois: currentMonth,
                            annee: currentYear,
                        },
                    });

                    console.log(
                        `✅ Paiement ${statut} pour ${prenom} ${nom} : ${transaction.value} € (total ${montantTotal}€ / loyer ${montantLoyer}€)`
                    );
                }
            }
        }

        return {
            status: 'ok',
            totalTransactions: transactions.length,
        };
    }





}