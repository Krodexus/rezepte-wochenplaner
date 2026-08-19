"use server"

import { createPlannerEntry, getPlannerEntries, updatePlannerEntry } from "@/lib/db/planner";
import { createPlannerEntrySchema, updatePlannerEntrySchema } from "@/lib/validations/planner";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createPlannerEntryAction(formData: FormData) {
    const result = createPlannerEntrySchema.safeParse(Object.fromEntries(formData));
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

