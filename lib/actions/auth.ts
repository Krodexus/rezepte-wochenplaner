"use server"

import { auth } from "../auth";
import { headers } from "next/headers";
import type { UpdatePasswordInput } from "../validations/user";
import { updatePasswordSchema } from "../validations/user";

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