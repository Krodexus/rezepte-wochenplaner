"use client";

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteAllPlannerEntriesAction } from "@/lib/actions/planner"
import GlassButton from "./navbarButton"
import { Trash } from "lucide-react"
import { LogOut } from "lucide-react"

export default function NavBar() {
    const router = useRouter();

    const { data: session, error } = authClient.useSession()

    async function logout() {
        await authClient.signOut();
        router.push("/")
    }

    return (
        <div className="fixed flex flex-col justify-center items-center gap-5 bottom-2 p-5">
            
                <GlassButton icon={<Trash />} action={deleteAllPlannerEntriesAction}/>
                {/* <span>
                    {session?.user?.name ?? session?.user?.email ?? "Nicht angemeldet"}
                </span> */}
                <GlassButton icon={<LogOut />} action={logout} />
            
        </div>
        
    )
}