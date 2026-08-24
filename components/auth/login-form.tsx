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
import { authClient } from "@/lib/auth-client";

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

        const { error } = await authClient.signIn.email({
            email,
            password
        });

        setIsLoading(false);

        if (error) {
            setErrorMessage(error.message ?? "Anmeldung fehlgeschlagen.");
            return;
        }

        router.replace("/planner");
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>Melde dich in deinem Account an</CardTitle>
                    <CardDescription>
                        Wenn du angemeldet bist, kannst du auf deine Wochenpläne zugreifen
                    </CardDescription>
                    <CardAction>
                        <Link href="/register"><Button variant="link" type="button">Registrieren</Button></Link>
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-Mail</Label>
                            <Input id="email" name="email" type="email" placeholder="max@beispiel.de" autoComplete="email" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Passwort</Label>
                            <Input id="password" name="password" type="password" placeholder="**********" required />
                        </div>

                        {errorMessage && (
                            <p role="alert" aria-live="polite" className="text-sm text-red-600">{errorMessage}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Wird angemeldet..." : "Anmelden"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
