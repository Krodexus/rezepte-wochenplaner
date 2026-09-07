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

// deletePlannerEntry