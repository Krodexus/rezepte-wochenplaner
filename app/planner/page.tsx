import NavBar from "@/components/main/navbar";
import Planner from "@/components/planner/planner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPlannerEntries } from "@/lib/db/plannerEntry";
import { getPlanner } from "@/lib/db/planner";
import { createPlanner } from "@/lib/db/planner";
import Image from "next/image";

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
        startDay: planner.startDay,
        length: planner.length,
    };

    const entryList = await getPlannerEntries(planner.id);

    return (
        <div className="min-h-screen pt-15 md:pt-0">
            <div className="fixed inset-0 -z-10">
                <Image src="/background.jpg" alt="Background Image" fill className="object-cover"/>  
            </div>       
            <Planner entryList={entryList} plannerData={plannerData} />
            <NavBar length={plannerData.length} startDay={plannerData.startDay}/>
        </div>
    )
}