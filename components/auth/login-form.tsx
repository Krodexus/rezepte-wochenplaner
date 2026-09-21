"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, getErrorMessage } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validations/user";



export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        // validate with zod
        const result = loginSchema.safeParse({
            email,
            password,
        })

        if (!result.success) {
            setErrorMessage(result.error.issues[0]?.message ?? "Ungültige Eingaben.");
            setIsLoading(false);
            return;
        }

        const { email: validEmail, password: validPassword } = result.data;

        // sign in user
        const { error } = await authClient.signIn.email({
            email: validEmail,
            password: validPassword,
        });

        setIsLoading(false);

        // auth error handling
        if (error?.code) {
            setErrorMessage(getErrorMessage(error.code, "de") ?? "Anmeldung fehlgeschlagen.");
            return;
        }

        router.replace("/planner");
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Schön, dich wiederzusehen!</h1>
                    <p className="text-balance text-muted-foreground">
                        Melde dich mit deinem Konto an
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">E-Mail</FieldLabel>
                    <Input id="email" name="email" type="email" placeholder="max@beispiel.de" autoComplete="email" required />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Passwort</FieldLabel>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                            Passwort vergessen?
                        </a>
                    </div>
                    <Input id="password" name="password" type="password" placeholder="**********" required />
                </Field>
                <Field>
                    <Button variant="color" type="submit" disabled={isLoading}>{isLoading ? "Wird angemeldet..." : "Anmelden"}</Button>
                    {errorMessage && (<p role="alert" aria-live="polite" className="text-sm text-red-600">{errorMessage}</p>)}
                </Field>
                <FieldDescription className="text-center">
                    Noch kein Konto? <a href="/register">Registrieren</a>
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}
