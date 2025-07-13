/*
  Warnings:

  - Added the required column `codePostal` to the `Bien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loyerMensuel` to the `Bien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixAchat` to the `Bien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Bien` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ville` to the `Bien` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bien" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "superficie" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "meuble" BOOLEAN NOT NULL DEFAULT false,
    "loyerMensuel" REAL NOT NULL,
    "chargesMensuelles" REAL,
    "prixAchat" REAL NOT NULL,
    "fraisNotaire" REAL,
    "fraisTravaux" REAL,
    "dateAcquisition" DATETIME,
    "description" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Bien_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bien" ("adresse", "id", "superficie", "titre", "type", "userId") SELECT "adresse", "id", "superficie", "titre", "type", "userId" FROM "Bien";
DROP TABLE "Bien";
ALTER TABLE "new_Bien" RENAME TO "Bien";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
