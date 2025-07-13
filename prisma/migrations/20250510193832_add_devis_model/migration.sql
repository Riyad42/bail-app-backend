-- CreateTable
CREATE TABLE "Devis" (
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
    "produitsBoutique" TEXT,
    "paiementBoutique" TEXT,
    "optionsLivraison" TEXT,
    "categoriesBlog" TEXT,
    "interactionsBlog" TEXT,
    "frequenceBlog" TEXT,
    "isSend" BOOLEAN NOT NULL DEFAULT false,
    "stepCompleted" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
