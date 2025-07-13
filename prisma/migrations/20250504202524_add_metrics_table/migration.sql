/*
  Warnings:

  - You are about to drop the column `totalUsers` on the `Metric` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Metric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "todayConnections" INTEGER NOT NULL,
    "contactClicks" INTEGER NOT NULL,
    "contactForms" INTEGER NOT NULL
);
INSERT INTO "new_Metric" ("contactClicks", "contactForms", "date", "id", "todayConnections") SELECT "contactClicks", "contactForms", "date", "id", "todayConnections" FROM "Metric";
DROP TABLE "Metric";
ALTER TABLE "new_Metric" RENAME TO "Metric";
CREATE UNIQUE INDEX "Metric_date_key" ON "Metric"("date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
