"use server"

import { UpdatePlannerInput } from "@/lib/validations/planner";
import { updatePlanner } from "@/lib/db/planner";

export async function updatePlannerAction(
    plannerId: string,
    updatePlannerInput: UpdatePlannerInput
) {
    console.log(plannerId);
    return await updatePlanner(plannerId, updatePlannerInput);
}