import LandingPage from "@/components/main/landing-page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/planner")
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 w-full">
      <div className="w-full max-w-sm md:max-w-5xl">
        <LandingPage />
      </div>
    </div>
  );
}
