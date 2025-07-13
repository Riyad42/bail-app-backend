/*
  Warnings:

  - A unique constraint covering the columns `[mois,annee,bailId]` on the table `PaiementLoyer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaiementLoyer_mois_annee_bailId_key" ON "PaiementLoyer"("mois", "annee", "bailId");
