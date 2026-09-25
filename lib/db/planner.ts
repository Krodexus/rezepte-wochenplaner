import { prisma } from "@/lib/db/prisma";
import type { UpdatePlannerInput } from "@/lib/validations/planner";

export async function getPlanner(userId: string) {
    return prisma.planner.findFirst({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        },
    })
}

export async function createPlanner(
    userId: string,
) {
    return prisma.planner.create({
        data: {
            userId
        }
    })
}

export async function updatePlanner(
    id: string,
    data: UpdatePlannerInput
) {
    return prisma.planner.update({
        where: {
            id,
        },
        data,
    })
}

// deletes the first `deletedDays` days, shifts the remaining entries up and adjusts startDay/length accordingly
export async function cleanupPlanner(
    plannerId: string,
    startDay: number,
    length: number,
    deletedDays: number,
) {
    return prisma.$transaction(async (tx) => {
        await tx.plannerEntry.deleteMany({
            where: {
                plannerId,
                day: { lte: deletedDays },
            },
        });

        // shift ascending by day so a target day is always vacated before it is reused
        const remainingEntries = await tx.plannerEntry.findMany({
            where: {
                plannerId,
                day: { gt: deletedDays },
            },
            orderBy: { day: "asc" },
        });

        for (const entry of remainingEntries) {
            await tx.plannerEntry.update({
                where: { id: entry.id },
                data: { day: entry.day - deletedDays },
            });
        }

        return tx.planner.update({
            where: { id: plannerId },
            data: {
                startDay: startDay + deletedDays,
                length: length - deletedDays,
            },
        });
    });
}