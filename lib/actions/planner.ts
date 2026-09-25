"use server"

import { UpdatePlannerInput, updatePlannerSchema } from "@/lib/validations/planner";
import { getPlanner, updatePlanner, cleanupPlanner } from "@/lib/db/planner";
import { upsertPlannerEntry, deletePlannerEntry, deletePlannerEntries, swapPlannerEntries, getPlannerEntries } from "@/lib/db/plannerEntry";
import { upsertEntrySchema, deleteEntrySchema, swapEntriesSchema, upsertPlannerEntryInput, deletePlannerEntryInput, swapPlannerEntriesInput } from "@/lib/validations/plannerEntry";
import { MealType } from "@/generated/enums";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

    revalidatePath("/planner");

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


export async function deletePlannerEntryAction(input: deletePlannerEntryInput) {
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


export async function swapPlannerEntriesAction(input: swapPlannerEntriesInput) {
    const result = swapEntriesSchema.safeParse(input);

    if (!result.success) {
        return { success: false, error: result.error.issues[0].message };
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

    await swapPlannerEntries(planner.id, result.data);

    revalidatePath("/planner");

    return { success: true };
};


export async function cleanupAction() {

    // deletes all leading days that are either empty or fully done, shifting the rest up
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) { return { success: false, error: "Unauthorized" }; };

    const planner = await getPlanner(session.session.userId);
    if (!planner) { return { success: false, error: "Planner not found" }; };

    const entries = await getPlannerEntries(planner.id)
    if (!entries) { return { success: false, error: "Could not load planner data" }; };

    const entriesByDay = new Map<number, typeof entries>();
    for (const entry of entries) {
        const dayEntries = entriesByDay.get(entry.day) ?? [];
        dayEntries.push(entry);
        entriesByDay.set(entry.day, dayEntries);
    }

    const mealTypes = Object.values(MealType);

    let deletedDays = 0;
    for (let day = 1; day <= planner.length; day++) {
        const dayEntries = entriesByDay.get(day) ?? [];

        const isEmpty = dayEntries.length === 0;
        const isFullyDone = mealTypes.every((mealType) =>
            dayEntries.some((entry) => entry.mealType === mealType && entry.isDone)
        );

        if (!isEmpty && !isFullyDone) break;

        deletedDays++;
    }

    if (deletedDays === 0) {
        return { success: true, deletedDays: 0 };
    }

    // always keep at least one day in the planner
    deletedDays = Math.min(deletedDays, planner.length - 1);

    await cleanupPlanner(planner.id, planner.startDay, planner.length, deletedDays);

    revalidatePath("/planner");

    return { success: true, deletedDays };
};