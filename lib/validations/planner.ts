import { z } from "zod";

export const createPlannerEntrySchema = z.object({
    day: z.int().min(1).max(14),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
    title: z.string().min(1).max(100),
    comment: z.string().max(500).optional()
})

export const updatePlannerEntrySchema = z.object({
    day: z.int().min(1).max(14).optional(),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]).optional(),
    title: z.string().min(1).max(100).optional(),
    comment: z.string().max(500).optional()
})

export type createPlannerEntryInput = 
    z.infer<typeof createPlannerEntrySchema>

export type updatePlannerEntryInput = 
    z.infer<typeof updatePlannerEntrySchema>