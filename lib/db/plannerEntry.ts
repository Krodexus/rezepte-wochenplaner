import { prisma } from "@/lib/db/prisma";
import type { createPlannerEntryInput, updatePlannerEntryInput } from "@/lib/validations/plannerEntry";

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
    id: string,
    data: updatePlannerEntryInput
) {
    return prisma.plannerEntry.upsert({
        where: { id },
        update: data,
        create: { ...data, plannerId }
    })
}

// deletePlannerEntry