/*
  Warnings:

  - The `startDay` column on the `Planner` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Planner" DROP COLUMN "startDay",
ADD COLUMN     "startDay" INTEGER NOT NULL DEFAULT 1;
