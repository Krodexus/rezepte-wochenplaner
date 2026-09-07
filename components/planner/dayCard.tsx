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
        <Card className="w-full py-2 gap-2 md:gap-5 md:py-5">
            <CardHeader>
                <CardTitle className="text-center text-sm md:text-base">{weekday}</CardTitle>
            </CardHeader>
            <CardContent className="px-2 md:px-5">
                <div className="flex flex-col gap-1 md:gap-4">
                    <DayCardRow mealType="BREAKFAST" position={position} entry={breakfast} />
                    <DayCardRow mealType="LUNCH" position={position} entry={lunch} />
                    <DayCardRow mealType="DINNER" position={position} entry={dinner} />
                </div>
            </CardContent>
        </Card >
    )
}