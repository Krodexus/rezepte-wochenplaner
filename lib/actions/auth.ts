"use server"

import { auth } from "../auth";
import { headers } from "next/headers";
import type { UpdatePasswordInput } from "../validations/user";
import { updatePasswordSchema } from "../validations/user";
import { prisma } from "../db/prisma";

export async function updatePasswordAction(updatePasswordInput: UpdatePasswordInput) {
    const result = updatePasswordSchema.safeParse(updatePasswordInput);

    if (!result.success) {
        return {
            success: false,
            error: result.error.issues[0].message,
        };
    };

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Unauthorized" };
    };

    try {
        const data = await auth.api.changePassword({
            body: {
                newPassword: result.data.newPassword,
                currentPassword: result.data.currentPassword
            },

            headers: await headers(),
        })
        return { success: true }
    } catch {
        return { success: false, error: "Falsches Passwort." }
    }
}

export async function deleteUserAction() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Du scheinst nicht angemeldet zu sein." };
    };

    try {
        await prisma.$transaction([
            prisma.plannerEntry.deleteMany({
                where: { planner: { userId: session.user.id } },
            }),
            prisma.planner.deleteMany({
                where: { userId: session.user.id },
            }),
        ]);

        const data = await auth.api.deleteUser({
            headers: await headers(),
            body: {}
        })
        if (!data.success) {
            return { success: false, error: data.message }
        }
        return { success: true, error: "" }
    } catch (error) {
        return { success: false, error: String(error) }
    }
}