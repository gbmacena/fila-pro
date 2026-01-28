/*
  Warnings:

  - A unique constraint covering the columns `[code,userId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Ticket_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_code_userId_key" ON "Ticket"("code", "userId");
