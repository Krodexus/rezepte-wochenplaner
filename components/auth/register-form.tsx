"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { authClient, getErrorMessage } from "@/lib/auth-client";
import { registerSchema } from "@/lib/validations/user";
import { Checkbox } from "../ui/checkbox";

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const email = String(formData.get("email") ?? "").trim();
        const name = String(formData.get("name") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const repeatPassword = String(formData.get("repeatPassword") ?? "");

        // validate with zod
        const result = registerSchema.safeParse({
            name,
            email,
            password,
            repeatPassword,
        });

        if (!result.success) {
            setErrorMessage(result.error.issues[0]?.message ?? "Ungültige Eingabe.");
            setIsLoading(false);
            return;
        };

        const { name: validName, email: validEmail, password: validPassword } = result.data;

        // sign up user
        const { error } = await authClient.signUp.email({
            email: validEmail,
            password: validPassword,
            name: validName,
        });

        setIsLoading(false);

        // auth error handling
        if (error?.code) {
            setErrorMessage(getErrorMessage(error.code, "de") ?? "Registrierung fehlgeschlagen.");
            return;
        }

        router.replace("/planner");
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Erstelle ein neues Konto</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Mit einem Konto kannst du auf alle Funktionen im Planer zugreifen
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">E-Mail</FieldLabel>
                    <Input id="email" name="email" type="email" placeholder="max@beispiel.de" autoComplete="email" required />
                    <FieldDescription>
                        Deine E-Mail wird nur für deine Kontoverwaltung benötigt.
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">Nutzername</FieldLabel>
                    <Input id="name" name="name" type="text" placeholder="Max" autoComplete="name" required />
                </Field>
                <Field>
                    <Field className="grid grid-cols-2 gap-4 items-end">
                        <Field>
                            <FieldLabel htmlFor="password">Passwort</FieldLabel>
                            <Input id="password" name="password" type="password" placeholder="**********" autoComplete="new-password" required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="repeatPassword">
                                Passwort wiederholen
                            </FieldLabel>
                            <Input id="repeatPassword" name="repeatPassword" type="password" placeholder="**********" autoComplete="new-password" required />
                        </Field>
                    </Field>
                    <FieldDescription>
                        Mindestens 8 Zeichen aus Buchstaben und Zahlen.
                    </FieldDescription>
                </Field>
                <Field orientation="horizontal">
                    <Checkbox id="terms-checkbox" name="terms-checkbox" required />
                    <FieldLabel htmlFor="terms-checkbox" className="text-sm font-normal">
                        Ich akzeptiere die Nutzungsbedingungen (AGB)
                    </FieldLabel>
                </Field>
                <Field>
                    <Button variant="color" type="submit" disabled={isLoading}>{isLoading ? "Wird erstellt..." : "Kostenloses Konto erstellen"}</Button>
                    {errorMessage && (
                        <p role="alert" aria-live="polite" className="text-sm text-red-600">{errorMessage}</p>
                    )}
                </Field>
                <FieldDescription className="text-center">
                    Du hast bereits ein Konto? <Link href="/login">Anmelden</Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}




