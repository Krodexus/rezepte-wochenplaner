/*
  Warnings:

  - A unique constraint covering the columns `[plannerId,day,mealType]` on the table `PlannerEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlannerEntry_plannerId_day_mealType_key" ON "PlannerEntry"("plannerId", "day", "mealType");
