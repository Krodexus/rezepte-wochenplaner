import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {

  return (
    <div className="flex flex-1 justify-center items-center">
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
