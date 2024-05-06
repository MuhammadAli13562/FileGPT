/*
  Warnings:

  - A unique constraint covering the columns `[fileKey]` on the table `Context_Window` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Context_Window_fileKey_key" ON "Context_Window"("fileKey");
