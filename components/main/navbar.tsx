"use client";

import { SettingsDialog, ProfileDialog, DeleteDialog } from "./navbarDialog";

type NavbarProps = {
    startDay: number,
    length: number
}

export default function NavBar(navbarProps: NavbarProps) {
    return (
        <div className="w-full fixed top-0 md:h-full md:flex md:justify-center bg-linear-to-b from-white/90 via-white/60 md:bg-none">
            <div className="flex justify-center items-start md:flex-col w-full gap-5 p-4 md:max-w-4xl">
                <SettingsDialog plannerData={navbarProps} />
                <DeleteDialog />
                <ProfileDialog />
            </div>
        </div>
    )
}