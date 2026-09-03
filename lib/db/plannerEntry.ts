import { prisma } from "@/lib/db/prisma";
import type { createPlannerEntryInput, updatePlannerEntryInput, deletePlannerEntryInput } from "@/lib/validations/plannerEntry";
import { MealType } from "@/generated/enums";

export async function getPlannerEntries(plannerId: string) {
    return prisma.plannerEntry.findMany({
        where: {
            plannerId,
        },
        orderBy: {
            createdAt: "asc",
        },
    })
}

export async function createPlannerEntry(
    plannerId: string,
    data: createPlannerEntryInput
) {
    return prisma.plannerEntry.create({
        data: {
            ...data,
            plannerId
        }
    })
}

export async function updatePlannerEntry(
    id: string,
    data: updatePlannerEntryInput
) {
    return prisma.plannerEntry.update({
        where: {
            id,
        },
        data,
    })
}

export async function upsertPlannerEntry(
    plannerId: string,
    data: createPlannerEntryInput
) {
    const {day, mealType, ...entryData} = data;

    return prisma.plannerEntry.upsert({
        where: { 
            plannerId_day_mealType: {
                plannerId,
                day,
                mealType
            } 
        },
        update: entryData,
        create: { 
            plannerId,
            day,
            mealType,
            ...entryData,
         }
    })
}

export async function deletePlannerEntry(
    plannerId: string,
    data: deletePlannerEntryInput
) {
    const {day, mealType} = data;

    return prisma.plannerEntry.delete({
        where: {
            plannerId_day_mealType: {
                plannerId,
                day,
                mealType
            },
        },
    });
}

export async function deletePlannerEntries(
    plannerId: string,
) {
    return prisma.plannerEntry.deleteMany({
        where: {
            plannerId
        }
    })
}