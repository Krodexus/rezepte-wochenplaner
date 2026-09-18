"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { PlannerEntry } from "@/generated/browser";
import DayCardRow from "./dayCardRow";

type DayCardProps = {
    calcDay: number;
    position: number;
    entries: PlannerEntry[];
}

export default function DayCard({ calcDay, position, entries }: DayCardProps) {

    const breakfast = entries.find(
        (entry) => entry.mealType === "BREAKFAST"
    ) ?? null;
    const lunch = entries.find(
        (entry) => entry.mealType === "LUNCH"
    ) ?? null;
    const dinner = entries.find(
        (entry) => entry.mealType === "DINNER"
    ) ?? null;

    // identify start day and get weekday
    let day = (calcDay + 6) % 7;
    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    const weekday = weekdays[day];

    return (
        <div className="flex flex-col w-full gap-2 md:gap-4">
            <div className="flex items-center gap-3 md:pt-5">
                <div className="border-b border-gray-400 grow"></div>
                <div className="text-gray-500 text-xs md:text-sm">{weekday}</div>
                <div className="border-b border-gray-400 grow"></div>
            </div>
            <div className="flex flex-col gap-1 md:gap-4">
                <DayCardRow mealType="BREAKFAST" position={position} entry={breakfast} />
                <DayCardRow mealType="LUNCH" position={position} entry={lunch} />
                <DayCardRow mealType="DINNER" position={position} entry={dinner} />
            </div>
        </div >
    )
}