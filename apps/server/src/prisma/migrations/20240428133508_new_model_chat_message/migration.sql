/*
  Warnings:

  - You are about to drop the column `chatMessages` on the `Context_Window` table. All the data in the column will be lost.
  - Added the required column `chatEngineMessages` to the `Context_Window` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Context_Window" DROP COLUMN "chatMessages",
ADD COLUMN     "chatEngineMessages" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Chat_Message" (
    "Id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "ContextWindowId" INTEGER NOT NULL,

    CONSTRAINT "Chat_Message_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Chat_Message" ADD CONSTRAINT "Chat_Message_ContextWindowId_fkey" FOREIGN KEY ("ContextWindowId") REFERENCES "Context_Window"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
