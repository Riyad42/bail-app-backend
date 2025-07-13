/*
  Warnings:

  - Added the required column `civilite` to the `Locataire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prenom` to the `Locataire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Locataire` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Locataire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "civilite" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "adresse" TEXT,
    "dateNaissance" DATETIME,
    "typeLocataire" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Locataire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Locataire" ("email", "id", "nom", "tel", "userId") SELECT "email", "id", "nom", "tel", "userId" FROM "Locataire";
DROP TABLE "Locataire";
ALTER TABLE "new_Locataire" RENAME TO "Locataire";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
