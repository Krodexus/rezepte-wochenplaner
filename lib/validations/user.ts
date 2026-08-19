import { z } from "zod";

export const createUserSchema = z.object({
    userName: z.string()
        .min(3, { message: "Name muss mindestens 3 Zeichen lang sein."})
        .max(20, { message: "Name darf höchstens 20 Zeichen lang sein."}),
    email: z
        .email({ message: "Bitte gib eine gültige E-Mail an."}),
    password: z.string().min(8).max(100),
})

export const updateUserSchema = z.object({
    userName: z.string()
        .min(3, { message: "Name muss mindestens 3 Zeichen lang sein."})
        .max(20, { message: "Name darf höchstens 20 Zeichen lang sein."})
        .optional(),
    email: z
        .email({ message: "Bitte gib eine gültige E-Mail an."})
        .optional(),
    password: z.string().min(8).max(100).optional(),
})

export type createUserInput = 
    z.infer<typeof createUserSchema>

export type updateUserInput = 
    z.infer<typeof updateUserSchema>