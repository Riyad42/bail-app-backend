-- CreateTable
CREATE TABLE "TransactionDetectee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "webid" TEXT NOT NULL,
    "locataireId" INTEGER NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TransactionDetectee_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "Locataire" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionDetectee_webid_key" ON "TransactionDetectee"("webid");
