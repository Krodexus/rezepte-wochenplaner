import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/planner")
  };

  return (
    <div className="flex flex-1 justify-center items-center p-4">
      <div className="fixed inset-0 -z-10">
        <Image src="/background.jpg" alt="Background Image" fill className="object-cover" />
      </div>
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Willkommen beim Wochenplaner</CardTitle>
          <CardDescription>
            Du benötigst einen kostenlosen Account, um deinen Wochenplan zu erstellen und zu speichern.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6 items-center">
            <Link href="/login">Anmelden</Link>
            <Link href="/register">Registrieren</Link>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">

        </CardFooter>
      </Card>
    </div>
  );
}
