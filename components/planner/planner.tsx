"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import DayCard from "@/components/planner/dayCard";
import { Card } from "@/components/ui/card";
import { updatePlannerAction } from "@/lib/actions/planner";
import { useState } from "react";

type PlannerData = {
    id: string,
    startDay: number,
    length: number,
}

export default function Planner({ entryList, plannerData }: { entryList: object, plannerData: PlannerData }) {

    const [startDay, setStartDay] = useState(plannerData.startDay);
    const [length, setLength] = useState(plannerData.length.toString());

    function handleStartDayChange(e: any) {
        setStartDay(e);
        updatePlannerAction(plannerData.id, {
            startDay: Number(e),
        });
    };

    function handleLengthChange(e: any) {
        setLength(e.target.value);
        updatePlannerAction(plannerData.id, {
            length: Number(e.target.value),
        });
    };

    // weekday items for dropdown
    const weekdays = [
        { label: "Montag", value: 1 },
        { label: "Dienstag", value: 2 },
        { label: "Mittwoch", value: 3 },
        { label: "Donnerstag", value: 4 },
        { label: "Freitag", value: 5 },
        { label: "Samstag", value: 6 },
        { label: "Sonntag", value: 7 },
    ]

    return (
        <Card className="flex flex-col h-full w-full max-w-2xl justify-center items-center gap-5 p-5">
            <div className="flex flex-col w-full gap-5">
                <Select items={weekdays} value={startDay} onValueChange={handleStartDayChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {weekdays.map((weekday) => (
                                <SelectItem key={weekday.value} value={weekday.value}>
                                    {weekday.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input id="length" type="number" value={length} onChange={handleLengthChange}>
                </Input>
            </div>
            <div className="flex flex-col w-full gap-5">
                {Array.from({ length: Number(length) }).map((_, index) => (
                    <DayCard key={index}
                        calcDay={Number(startDay) + index}
                        entryList={entryList} />
                ))}
            </div>
        </Card >
    )
}