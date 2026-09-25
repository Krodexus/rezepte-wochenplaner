import { prisma } from "@/lib/db/prisma";
import type { upsertPlannerEntryInput, deletePlannerEntryInput, swapPlannerEntriesInput } from "@/lib/validations/plannerEntry";

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
    data: upsertPlannerEntryInput
) {
    return prisma.plannerEntry.create({
        data: {
            ...data,
            plannerId
        }
    })
}

export async function upsertPlannerEntry(
    plannerId: string,
    data: upsertPlannerEntryInput
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

export async function swapPlannerEntries(
    plannerId: string,
    { source, target }: swapPlannerEntriesInput
) {
    return prisma.$transaction(async (tx) => {
        const [sourceEntry, targetEntry] = await Promise.all([
            tx.plannerEntry.findUnique({
                where: { plannerId_day_mealType: { plannerId, ...source } },
            }),
            tx.plannerEntry.findUnique({
                where: { plannerId_day_mealType: { plannerId, ...target } },
            }),
        ]);

        if (!sourceEntry && !targetEntry) return;

        // move the source out of the way first so the unique (plannerId, day, mealType) constraint never clashes
        if (sourceEntry) {
            await tx.plannerEntry.update({
                where: { id: sourceEntry.id },
                data: { day: -1 },
            });
        }

        if (targetEntry) {
            await tx.plannerEntry.update({
                where: { id: targetEntry.id },
                data: { day: source.day, mealType: source.mealType },
            });
        }

        if (sourceEntry) {
            await tx.plannerEntry.update({
                where: { id: sourceEntry.id },
                data: { day: target.day, mealType: target.mealType },
            });
        }
    });
}