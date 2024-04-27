-- CreateTable
CREATE TABLE "User" (
    "Id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Context_Window" (
    "Id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatMessages" JSONB NOT NULL,
    "vectorURL" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileURL" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Context_Window_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Context_Window" ADD CONSTRAINT "Context_Window_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
