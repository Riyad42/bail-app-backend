/*
  Warnings:

  - You are about to drop the column `powensAccessToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `powensAccessTokenExpiresAt` on the `User` table. All the data in the column will be lost.

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
    "fiabilite" INTEGER NOT NULL DEFAULT 100,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Locataire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Locataire" ("actif", "adresse", "civilite", "createdAt", "dateNaissance", "email", "id", "nom", "prenom", "tel", "typeLocataire", "updatedAt", "userId") SELECT "actif", "adresse", "civilite", "createdAt", "dateNaissance", "email", "id", "nom", "prenom", "tel", "typeLocataire", "updatedAt", "userId" FROM "Locataire";
DROP TABLE "Locataire";
ALTER TABLE "new_Locataire" RENAME TO "Locataire";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "powensAuthToken" TEXT,
    "powensConnectionId" TEXT
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "onboardingCompleted", "password", "powensAuthToken", "powensConnectionId", "role") SELECT "createdAt", "email", "id", "name", "onboardingCompleted", "password", "powensAuthToken", "powensConnectionId", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
