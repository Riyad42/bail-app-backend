/*
  Warnings:

  - You are about to alter the column `produitsBoutique` on the `Devis` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Devis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "prestation" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "preference" TEXT NOT NULL,
    "pagesVitrine" TEXT,
    "designRefVitrine" TEXT,
    "fonctionnalitesVitrine" TEXT,
    "produitsBoutique" INTEGER,
    "paiementBoutique" TEXT,
    "optionsLivraison" TEXT,
    "categoriesBlog" TEXT,
    "interactionsBlog" TEXT,
    "frequenceBlog" TEXT,
    "step" INTEGER NOT NULL,
    "isSend" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Devis" ("categoriesBlog", "createdAt", "designRefVitrine", "email", "fonctionnalitesVitrine", "frequenceBlog", "id", "interactionsBlog", "isRead", "isSend", "message", "nom", "optionsLivraison", "pagesVitrine", "paiementBoutique", "preference", "prenom", "prestation", "produitsBoutique", "step", "telephone") SELECT "categoriesBlog", "createdAt", "designRefVitrine", "email", "fonctionnalitesVitrine", "frequenceBlog", "id", "interactionsBlog", "isRead", "isSend", "message", "nom", "optionsLivraison", "pagesVitrine", "paiementBoutique", "preference", "prenom", "prestation", "produitsBoutique", "step", "telephone" FROM "Devis";
DROP TABLE "Devis";
ALTER TABLE "new_Devis" RENAME TO "Devis";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
