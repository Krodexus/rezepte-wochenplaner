"use client";

import { SettingsDialog, ProfileDialog, DeleteDialog } from "./navbarDialog";

type NavbarProps = {
    startDay: number,
    length: number
}

export default function NavBar(navbarProps: NavbarProps) {
    return (
        // <div className="w-full fixed top-0 md:h-full md:flex md:justify-center bg-linear-to-b from-white/90 via-white/60 md:bg-none pointer-events-none">
            <div className="fixed md:h-screen w-full md:w-fit flex justify-center items-start md:flex-col gap-5 p-4 bg-linear-to-b from-white/90 via-white/80 md:bg-none">
                <SettingsDialog plannerData={navbarProps} />
                <DeleteDialog />
                <ProfileDialog />
            </div>
        // </div>
    )
}