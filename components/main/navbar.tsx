"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NavBar() {
    const router = useRouter();

    const { data: session, error} = authClient.useSession()

    async function logout() {
        await authClient.signOut();

        router.push("/")
    }

    return (
        <div className="w-full h-16 fixed bottom-0 bg-accent flex justify-center items-center gap-5">
            <span>
                {session?.user?.name ?? session?.user?.email ?? "Nicht angemeldet"}
            </span>
            <Button onClick={logout}>Abmelden</Button>
        </div>
    )
}