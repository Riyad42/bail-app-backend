/*
  Warnings:

  - Added the required column `updatedAt` to the `Bail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL,
    "montant" REAL NOT NULL,
    "chargesMensuelles" REAL,
    "typeBail" TEXT,
    "paiementLe" INTEGER,
    "caution" REAL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bienId" INTEGER NOT NULL,
    "locataireId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Bail_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bail_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "Locataire" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bail" ("bienId", "dateDebut", "dateFin", "id", "locataireId", "montant", "userId") SELECT "bienId", "dateDebut", "dateFin", "id", "locataireId", "montant", "userId" FROM "Bail";
DROP TABLE "Bail";
ALTER TABLE "new_Bail" RENAME TO "Bail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
