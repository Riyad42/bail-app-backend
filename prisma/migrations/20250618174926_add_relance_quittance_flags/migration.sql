-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaiementLoyer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "statut" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "datePaiement" DATETIME,
    "relanceEnvoyee" BOOLEAN NOT NULL DEFAULT false,
    "quittanceEnvoyee" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bailId" INTEGER NOT NULL,
    "locataireId" INTEGER NOT NULL,
    CONSTRAINT "PaiementLoyer_bailId_fkey" FOREIGN KEY ("bailId") REFERENCES "Bail" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PaiementLoyer_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "Locataire" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PaiementLoyer" ("annee", "bailId", "createdAt", "datePaiement", "id", "locataireId", "mois", "montant", "statut", "updatedAt") SELECT "annee", "bailId", "createdAt", "datePaiement", "id", "locataireId", "mois", "montant", "statut", "updatedAt" FROM "PaiementLoyer";
DROP TABLE "PaiementLoyer";
ALTER TABLE "new_PaiementLoyer" RENAME TO "PaiementLoyer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
