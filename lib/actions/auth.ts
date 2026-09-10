import { authClient } from "../auth-client";
import { auth } from "../auth";
import { headers } from "next/headers";
import type { updateUserInput } from "../validations/user";
import { updateUserSchema } from "../validations/user";

export async function updateUserAction(updateUserInput: updateUserInput) {
    const result = updateUserSchema.safeParse(updateUserInput);

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


}