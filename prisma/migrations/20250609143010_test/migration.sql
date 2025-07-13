/*
  Warnings:

  - You are about to drop the `Commentaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Devis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Metric` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Commentaire";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Devis";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Metric";
PRAGMA foreign_keys=on;
