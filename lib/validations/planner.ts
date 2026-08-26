import { z } from "zod";

export const createEntrySchema = z.object({
    day: z.int(),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
    title: z.string()
        .min(1, { error: "Du musst eine Mahlzeit eingeben." })
        .max(100, { error: "Die maximale Länge der Mahlzeit beträgt 100 Zeichen." }),
    comment: z.string()
        .max(500, { error: "Das Kommentar ist zu lang." })
        .optional()
})

export const updateEntrySchema = z.object({
    id: z.string()
        .min(1, { error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." }),
    day: z.int().min(1).max(14).optional(),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]).optional(),
    title: z.string()
        .min(1, { error: "Du musst eine Mahlzeit eingeben." })
        .max(100, { error: "Die maximale Länge der Mahlzeit beträgt 100 Zeichen." })
        .optional(),
    comment: z.string()
        .max(500, { error: "Das Kommentar ist zu lang." })
        .optional()
})

export const deleteEntrySchema = z.object({
    id: z.string()
        .min(1, { error: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." }),
})

export type createPlannerEntryInput =
    z.infer<typeof createEntrySchema>

export type updatePlannerEntryInput =
    z.infer<typeof updateEntrySchema>