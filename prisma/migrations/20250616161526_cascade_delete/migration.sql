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
    "documentUrl" TEXT,
    "bienId" INTEGER NOT NULL,
    "locataireId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Bail_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "Bien" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bail_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "Locataire" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Bail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bail" ("actif", "bienId", "caution", "chargesMensuelles", "createdAt", "dateDebut", "dateFin", "documentUrl", "id", "locataireId", "montant", "paiementLe", "typeBail", "updatedAt", "userId") SELECT "actif", "bienId", "caution", "chargesMensuelles", "createdAt", "dateDebut", "dateFin", "documentUrl", "id", "locataireId", "montant", "paiementLe", "typeBail", "updatedAt", "userId" FROM "Bail";
DROP TABLE "Bail";
ALTER TABLE "new_Bail" RENAME TO "Bail";
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
    CONSTRAINT "Bien_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bien" ("actif", "adresse", "chargesMensuelles", "codePostal", "createdAt", "dateAcquisition", "description", "fraisNotaire", "fraisTravaux", "id", "loyerMensuel", "meuble", "prixAchat", "superficie", "titre", "type", "updatedAt", "userId", "ville") SELECT "actif", "adresse", "chargesMensuelles", "codePostal", "createdAt", "dateAcquisition", "description", "fraisNotaire", "fraisTravaux", "id", "loyerMensuel", "meuble", "prixAchat", "superficie", "titre", "type", "updatedAt", "userId", "ville" FROM "Bien";
DROP TABLE "Bien";
ALTER TABLE "new_Bien" RENAME TO "Bien";
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
    CONSTRAINT "Locataire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Locataire" ("actif", "adresse", "civilite", "createdAt", "dateNaissance", "email", "id", "nom", "prenom", "tel", "typeLocataire", "updatedAt", "userId") SELECT "actif", "adresse", "civilite", "createdAt", "dateNaissance", "email", "id", "nom", "prenom", "tel", "typeLocataire", "updatedAt", "userId" FROM "Locataire";
DROP TABLE "Locataire";
ALTER TABLE "new_Locataire" RENAME TO "Locataire";
CREATE TABLE "new_PaiementLoyer" (
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
    CONSTRAINT "PaiementLoyer_bailId_fkey" FOREIGN KEY ("bailId") REFERENCES "Bail" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PaiementLoyer_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "Locataire" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PaiementLoyer" ("annee", "bailId", "createdAt", "datePaiement", "id", "locataireId", "mois", "montant", "statut", "updatedAt") SELECT "annee", "bailId", "createdAt", "datePaiement", "id", "locataireId", "mois", "montant", "statut", "updatedAt" FROM "PaiementLoyer";
DROP TABLE "PaiementLoyer";
ALTER TABLE "new_PaiementLoyer" RENAME TO "PaiementLoyer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
