"use server"

import { createPlannerEntry } from "@/lib/db/plannerEntry";
import { createEntrySchema } from "@/lib/validations/plannerEntry";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createPlannerEntryAction(formData: FormData) {
    const result = createEntrySchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            success: false,
            errors: z.treeifyError(result.error),
        }
    }

    const userId = "TEMP_USER_ID";

    await createPlannerEntry(
        userId,
        result.data,
    );
    revalidatePath("/planner");
}

