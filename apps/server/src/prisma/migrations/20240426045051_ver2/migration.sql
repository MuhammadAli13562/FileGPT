/*
  Warnings:

  - You are about to drop the column `storagePath` on the `Context_Window` table. All the data in the column will be lost.
  - Added the required column `pdfKey` to the `Context_Window` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfName` to the `Context_Window` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfURL` to the `Context_Window` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vectorURL` to the `Context_Window` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Context_Window" DROP COLUMN "storagePath",
ADD COLUMN     "pdfKey" TEXT NOT NULL,
ADD COLUMN     "pdfName" TEXT NOT NULL,
ADD COLUMN     "pdfURL" TEXT NOT NULL,
ADD COLUMN     "vectorURL" TEXT NOT NULL;
