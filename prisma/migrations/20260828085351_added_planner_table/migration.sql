/*
  Warnings:

  - You are about to drop the column `userId` on the `PlannerEntry` table. All the data in the column will be lost.
  - Added the required column `plannerId` to the `PlannerEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlannerEntry" DROP CONSTRAINT "PlannerEntry_userId_fkey";

-- AlterTable
ALTER TABLE "PlannerEntry" DROP COLUMN "userId",
ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plannerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Planner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDay" TEXT NOT NULL DEFAULT 'MONDAY',
    "length" INTEGER NOT NULL DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Planner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Planner" ADD CONSTRAINT "Planner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannerEntry" ADD CONSTRAINT "PlannerEntry_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "Planner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
