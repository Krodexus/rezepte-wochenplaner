"use client";

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import { UserRound } from "lucide-react";
import { Settings } from "lucide-react";

import { SettingsDialog, ProfileDialog, DeleteDialog } from "./navbarDialog";

type NavbarProps = {
    startDay: number,
    length: number
}

export default function NavBar(navbarProps: NavbarProps) {
    const router = useRouter();

    const { data: session, error } = authClient.useSession()

    async function logout() {
        await authClient.signOut();
        router.push("/")
    }

    return (
        <div className="flex justify-center items-end w-full h-30 md:flex-col fixed gap-5 bottom-0 p-4 bg-linear-to-t from-white/90 via-white/60">

            <SettingsDialog icon={<Settings />} plannerData={navbarProps} />
            <DeleteDialog icon={<Trash />} />
            <ProfileDialog icon={<UserRound />} />

            {/* <span>
                    {session?.user?.name ?? session?.user?.email ?? "Nicht angemeldet"}
                </span> */}

        </div>

    )
}