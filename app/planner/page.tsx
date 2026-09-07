import NavBar from "@/components/main/navbar";
import Planner from "@/components/planner/planner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPlannerEntries } from "@/lib/db/plannerEntry";
import { getPlanner } from "@/lib/db/planner";
import { createPlanner } from "@/lib/db/planner";

export default async function PlannerPage() {

    // load user session
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/login")
    }

    const userId = session.session.userId

    // create or load user planner
    let planner = await getPlanner(userId);
    if (!planner) {
        planner = await createPlanner(userId);
    };

    // generate plannerData
    const plannerData = {
        id: planner.id,
        startDay: planner.startDay,
        length: planner.length,
    };

    const entryList = await getPlannerEntries(planner.id);

    return (
        <div className="flex flex-col min-h-screen pb-16 bg-muted">
            <main className="flex-1 flex flex-col justify-center items-center p-5">
                <Planner entryList={entryList} plannerData={plannerData} />
            </main>
            <NavBar />
        </div>
    )
}