-- CreateTable
CREATE TABLE "PaiementLoyer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "statut" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "datePaiement" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bailId" INTEGER NOT NULL,
    "locataireId" INTEGER NOT NULL,
    CONSTRAINT "PaiementLoyer_bailId_fkey" FOREIGN KEY ("bailId") REFERENCES "Bail" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaiementLoyer_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "Locataire" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
