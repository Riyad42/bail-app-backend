-- CreateTable
CREATE TABLE "Metric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "totalUsers" INTEGER NOT NULL,
    "todayConnections" INTEGER NOT NULL,
    "contactClicks" INTEGER NOT NULL,
    "contactForms" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Metric_date_key" ON "Metric"("date");
