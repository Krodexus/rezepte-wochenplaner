import { z } from "zod";

export const registerSchema = z.object({
    name: z.string()
        .min(2, { error: "Name muss mindestens 2 Zeichen lang sein." })
        .max(30, { error: "Name darf höchstens 30 Zeichen lang sein." })
        .trim(),
    email: z
        .email({ error: "Bitte gib eine gültige E-Mail an." }).trim(),
    password: z.string()
        .min(8, { error: "Das Passwort muss mindestens 8 Zeichen lang sein." })
        .max(100, { error: "Das Passwort darf höchstens 100 Zeichen lang sein." })
        .regex(/[a-zA-Z]/, { error: "Das Passwort muss mindestens einen Buchstaben enthalten." })
        .regex(/[0-9]/, { error: "Das Passwort muss mindestens eine Zahl enthalten." }),
    repeatPassword: z.string(),
}).refine((data) => data.password === data.repeatPassword, {
    error: "Passwörter stimmen nicht überein.",
    path: ["repeatPassword"]
})

export const loginSchema = z.object({
    email: z
        .email({ error: "Bitte gib eine gültige E-Mail an." }).trim(),
    password: z.string()
        .min(8, { error: "Dein Passwort hat mindestens 8 Zeichen." })
        .max(100, { error: "Dein Passwort hat höchstens 100 Zeichen." })
})

export const updateUserSchema = z.object({
    name: z.string()
        .min(2, { message: "Name muss mindestens 2 Zeichen lang sein." })
        .max(30, { message: "Name darf höchstens 30 Zeichen lang sein." })
        .optional(),
    email: z
        .email({ message: "Bitte gib eine gültige E-Mail an." })
        .optional(),
    password: z.string().min(8).max(100).optional(),
})

export type createUserInput =
    z.infer<typeof registerSchema>

export type updateUserInput =
    z.infer<typeof updateUserSchema>