"use server"

import { UpdatePlannerInput, updatePlannerSchema } from "@/lib/validations/planner";
import { updatePlanner } from "@/lib/db/planner";
import { upsertPlannerEntry, deletePlannerEntry, deletePlannerEntries } from "@/lib/db/plannerEntry";
import { upsertEntrySchema, deleteEntrySchema, upsertPlannerEntryInput } from "@/lib/validations/plannerEntry";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPlanner } from "@/lib/db/planner";

export async function updatePlannerAction(
    updatePlannerInput: UpdatePlannerInput
) {
    const result = updatePlannerSchema.safeParse(updatePlannerInput);

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

    const planner = await getPlanner(session.session.userId);

    if (!planner) {
        return { success: false, error: "Planner not found" };
    };

    return await updatePlanner(planner.id, updatePlannerInput);
};


export async function upsertPlannerEntryAction(input: upsertPlannerEntryInput) {
    const result = upsertEntrySchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            error: result.error.issues[0].message
        };
    };

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Unauthorized" };
    };

    const planner = await getPlanner(session.session.userId);

    if (!planner) {
        return { success: false, error: "Planner not found" };
    };

    const entry = await upsertPlannerEntry(planner.id, result.data);

    revalidatePath("/planner");

    return { success: true, entry };
};


export async function deletePlannerEntryAction(input: unknown) {
    const result = deleteEntrySchema.safeParse(input);

    if (!result.success) {
        return {
            success: false,
            error: z.treeifyError(result.error)
        };
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Unauthorized" };
    };

    const planner = await getPlanner(session.session.userId);

    if (!planner) {
        return { success: false, error: "Planner not found" };
    };

    const entry = await deletePlannerEntry(planner.id, result.data);

    revalidatePath("/planner");

    return { success: true, entry };
};


export async function deleteAllPlannerEntriesAction() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Unauthorized" };
    };

    const planner = await getPlanner(session.session.userId);

    if (!planner) {
        return { success: false, error: "Planner not found" };
    };

    const entry = await deletePlannerEntries(planner.id);

    revalidatePath("/planner");

    return { success: true, entry }
};