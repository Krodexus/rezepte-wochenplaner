import { z } from "zod";

export const upsertEntrySchema = z.object({
    day: z.int(),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
    title: z.string()
        .max(100, { error: "Die Eingabe ist zu lang." }),
    comment: z.string()
        .max(500, { error: "Das Kommentar ist zu lang." })
        .optional(),
    isDone: z.boolean()
})

export const deleteEntrySchema = z.object({
    day: z.int().min(1).max(14),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
})

const daySlotSchema = z.object({
    day: z.int(),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
})

export const swapEntriesSchema = z.object({
    source: daySlotSchema,
    target: daySlotSchema,
})

export type upsertPlannerEntryInput =
    z.infer<typeof upsertEntrySchema>

export type deletePlannerEntryInput =
    z.infer<typeof deleteEntrySchema>

export type swapPlannerEntriesInput =
    z.infer<typeof swapEntriesSchema>