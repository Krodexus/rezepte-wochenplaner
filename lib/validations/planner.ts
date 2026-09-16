import { z } from "zod";

export const updatePlannerSchema = z.object({
    startDay: z.int().optional(),
    length: z.int().max(28, {error: "Die maximale Planlänge beträgt 28."}).optional(),
})

export type UpdatePlannerInput = z.infer<typeof updatePlannerSchema>