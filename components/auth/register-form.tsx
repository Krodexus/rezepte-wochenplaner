"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
    const userName = String(formData.get("userName") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const repeatPassword = String(formData.get("repeatPassword") ?? "");

    if (password !== repeatPassword) {
      setErrorMessage("Passwörter stimmen nicht überein.");
      setIsLoading(false);
      return;
    }

    const { error } = await authClient.signUp.email({
      email,
      password,
      name: userName,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message ?? "Registrierung fehlgeschlagen.");
      return;
    }

    router.push("/planner");
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
            <Button variant="link" type="button">Anmelden</Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" name="email" type="email" placeholder="max@beispiel.de" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userName">Nutzername</Label>
              <Input id="userName" name="userName" type="text" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" name="password" type="password" placeholder="**********" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repeatPassword">Passwort wiederholen</Label>
              <Input id="repeatPassword" name="repeatPassword" type="password" placeholder="**********" required />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
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
