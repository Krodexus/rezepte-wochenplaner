"use server"

import { UpdatePlannerInput } from "@/lib/validations/planner";
import { updatePlannerEntryInput } from "@/lib/validations/plannerEntry";
import { updatePlanner } from "@/lib/db/planner";
import { updatePlannerEntry } from "@/lib/db/plannerEntry";
import { createPlannerEntry } from "@/lib/db/plannerEntry";
import { createEntrySchema } from "@/lib/validations/plannerEntry";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updatePlannerAction(
    plannerId: string,
    updatePlannerInput: UpdatePlannerInput
) {
    return await updatePlanner(plannerId, updatePlannerInput);
}

export async function updatePlannerEntryAction(
    entryId: string,
    updateEntryInput: updatePlannerEntryInput,
) {
    return await updatePlannerEntry(entryId, updateEntryInput);
}

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