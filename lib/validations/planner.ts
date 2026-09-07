import { z } from "zod";

export const updatePlannerSchema = z.object({
    startDay: z.int().optional(),
    length: z.int().optional(),
})

export type UpdatePlannerInput = z.infer<typeof updatePlannerSchema>