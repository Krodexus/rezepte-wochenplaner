import NavBar from "@/components/main/navbar";
import Planner from "@/components/planner/planner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex flex-col min-h-screen pb-16">
            <main className="flex-1 flex flex-col justify-center items-center">
                <Planner />
            </main>
            <NavBar />
        </div>
    )
}