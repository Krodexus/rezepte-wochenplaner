import { prisma } from "@/lib/db/prisma";
import type { createPlannerEntryInput, updatePlannerEntryInput } from "@/lib/validations/planner";

export async function getPlannerEntries(userId: string) {
    return prisma.plannerEntry.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        },
    })
}

// getPlannerEntry

export async function createPlannerEntry(
    userId: string,
    data: createPlannerEntryInput
) {
    return prisma.plannerEntry.create({
        data: {
            ...data,
            userId
        }
    })
}

export async function updatePlannerEntry(
    id: string,
    userId: string,
    data: updatePlannerEntryInput
) {
    return prisma.plannerEntry.update({
        where: {
            id,
            userId,
        },
        data,
    })
}

// deletePlannerEntry