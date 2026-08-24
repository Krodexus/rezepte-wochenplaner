"use client"

import { authClient } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NavBar() {

    async function logout() {

    }

    return (
        <div className="w-full h-20 bg-accent flex justify-end p-3 gap-3">
            Test
            <Button>Abmelden</Button>
        </div>
    )
}