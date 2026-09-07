import { prisma } from "@/lib/db/prisma";
import type { createUserInput, updateUserInput } from "@/lib/validations/user";

export async function createUserEntry(
    data: createUserInput
) {
    return prisma.user.create({
        data: {
            ...data,
        }
    })
}

export async function updateUserEntry(
    id: string,
    data: updateUserInput
) {
    return prisma.user.update({
        where: {
            id
        },
        data
    })
}