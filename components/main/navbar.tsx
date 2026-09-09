"use client";

import { SettingsDialog, ProfileDialog, DeleteDialog } from "./navbarDialog";

type NavbarProps = {
    startDay: number,
    length: number
}

export default function NavBar(navbarProps: NavbarProps) {
    return (
        <div className="flex justify-center items-end md:items-start w-full md:flex-col fixed gap-5 bottom-0 p-7 bg-linear-to-t from-white/90 via-white/60 md:bg-none">
            <SettingsDialog plannerData={navbarProps} />
            <DeleteDialog />
            <ProfileDialog />
        </div>
    )
}