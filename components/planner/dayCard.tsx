"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Check, Sunrise, Sun, Sunset } from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";
import { PlannerEntry } from "@/generated/browser";
import { savePlannerEntryAction, deletePlannerEntryAction } from "@/lib/actions/planner";

type DayCardProps = {
    calcDay: number;
    position: number;
    entries: PlannerEntry[];
}

export default function DayCard({ calcDay, position, entries }: DayCardProps) {

    const breakfast = entries.find(
        (entry) => entry.mealType === "BREAKFAST"
    );
    const lunch = entries.find(
        (entry) => entry.mealType === "LUNCH"
    );
    const dinner = entries.find(
        (entry) => entry.mealType === "DINNER"
    );

    const [breakfastTitle, setBreakfast] = useState(breakfast?.title ?? "");
    const [lunchTitle, setLunch] = useState(lunch?.title ?? "");
    const [dinnerTitle, setDinner] = useState(dinner?.title ?? "");

    useEffect(() => {
        setBreakfast(breakfast?.title ?? "");
        setLunch(lunch?.title ?? "");
        setDinner(dinner?.title ?? "");
    }, [breakfast?.title, lunch?.title, dinner?.title]);

    // check if field has new title, changed title, or cleared title
    async function handleEntryBlur(
        mealType: "BREAKFAST" | "LUNCH" | "DINNER",
        previousTitle: string | undefined,
        currentTitle: string
    ) {
        const title = currentTitle.trim();
        const persistedTitle = previousTitle ?? "";

        if (title === persistedTitle) {
            return;
        }

        if (title === "") {
            if (!previousTitle) {
                return;
            }

            await deletePlannerEntryAction({
                day: position, mealType
            });
            return;
        }

        await savePlannerEntryAction({
            day: position,
            mealType,
            title,
        })
    }

    // identify start day
    let day = (calcDay + 6) % 7;

    // get weekday
    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    const weekday = weekdays[day];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{weekday}</CardTitle>
                <CardAction>
                    <Button variant="link">Einträge löschen</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    <div className="flex gap-2">
                        <Sunrise />
                        <Input
                            type="text"
                            placeholder="Müsli"
                            value={breakfastTitle}
                            onChange={(event) => setBreakfast(event.target.value)}
                            onBlur={(event) => 
                                handleEntryBlur(
                                    "BREAKFAST",
                                    breakfast?.title,
                                    event.currentTarget.value
                                )
                            }
                            className="overflow-scroll"
                        />
                        <Button variant="secondary" size="icon">
                            <Check />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Sun />
                        <Input
                            type="text"
                            placeholder="Senfeier"
                            value={lunchTitle}
                            onChange={(event) => setLunch(event.target.value)}
                            onBlur={(event) => 
                                handleEntryBlur(
                                    "LUNCH",
                                    lunch?.title,
                                    event.currentTarget.value
                                )
                            }
                        />
                        <Button variant="secondary" size="icon">
                            <Check />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Sunset />
                        <Input
                            type="text"
                            placeholder="Kartoffelauflauf"
                            value={dinnerTitle}
                            onChange={(event) => setDinner(event.target.value)}
                            onBlur={(event) => 
                                handleEntryBlur(
                                    "DINNER",
                                    dinner?.title,
                                    event.currentTarget.value
                                )
                            }
                        />
                        <Button variant="secondary" size="icon">
                            <Check />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}