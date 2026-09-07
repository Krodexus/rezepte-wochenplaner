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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, getErrorMessage } from "@/lib/auth-client";
import { registerSchema } from "@/lib/validations/user";

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
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>Erstelle einen neuen Account</CardTitle>
                    <CardDescription>
                        Erstelle, speichere und bearbeite deine Wochenpläne.
                    </CardDescription>
                    <CardAction>
                        <Link href="/login"><Button variant="link" type="button">Anmelden</Button></Link>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-Mail</Label>
                            <Input id="email" name="email" type="email" placeholder="max@beispiel.de" autoComplete="email" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" type="text" placeholder="Max" autoComplete="name" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Passwort</Label>
                            <Input id="password" name="password" type="password" placeholder="**********" autoComplete="new-password" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="repeatPassword">Passwort wiederholen</Label>
                            <Input id="repeatPassword" name="repeatPassword" type="password" placeholder="**********" autoComplete="new-password" required />
                        </div>

                        {errorMessage && (
                            <p role="alert" aria-live="polite" className="text-sm text-red-600">{errorMessage}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Wird erstellt..." : "Konto erstellen"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
