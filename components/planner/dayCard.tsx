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
import { upsertPlannerEntryAction, deletePlannerEntryAction } from "@/lib/actions/planner";
import { Textarea } from "@/components/ui/textarea";

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

    const [breakfastTitle, setBreakfastTitle] = useState(breakfast?.title ?? "");
    const [lunchTitle, setLunchTitle] = useState(lunch?.title ?? "");
    const [dinnerTitle, setDinnerTitle] = useState(dinner?.title ?? "");

    const [breakfastDone, setBreakfastDone] = useState(breakfast?.isDone ?? false)
    const [lunchDone, setLunchDone] = useState(lunch?.isDone ?? false)
    const [dinnerDone, setDinnerDone] = useState(dinner?.isDone ?? false)

    useEffect(() => {
        setBreakfastTitle(breakfast?.title ?? "");
        setLunchTitle(lunch?.title ?? "");
        setDinnerTitle(dinner?.title ?? "");
    }, [breakfast?.title, lunch?.title, dinner?.title]);

    // check if field has new title, changed title, or cleared title, then update accordingly
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

        await upsertPlannerEntryAction({
            day: position,
            mealType,
            title,
            isDone: false
        })
    }

    // mark meals as done
    async function markAsDone(
        mealType: "BREAKFAST" | "LUNCH" | "DINNER",
        title: string,
    ) {
        let isDone = false;

        if (mealType == "BREAKFAST") {
            isDone = !breakfastDone;
            setBreakfastDone(!breakfastDone);
        } else if (mealType == "LUNCH") {
            isDone = !lunchDone;
            setLunchDone(!lunchDone);
        } else {
            isDone = !dinnerDone;
            setDinnerDone(!dinnerDone)
        }

        await upsertPlannerEntryAction({
            day: position,
            mealType,
            title,
            isDone
        })
    }

    // identify start day
    let day = (calcDay + 6) % 7;

    // get weekday
    const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    const weekday = weekdays[day];

    return (
        <Card className="w-full py-2 gap-2 md:gap-5 md:py-5">
            <CardHeader>
                <CardTitle className="text-center text-sm md:text-base">{weekday}</CardTitle>
            </CardHeader>
            <CardContent className="px-2 md:px-5">
                <div className="flex flex-col gap-1 md:gap-4">
                    <div className="flex gap-2">
                        <Sunrise />
                        <Textarea
                            value={breakfastTitle}
                            onChange={(event) => setBreakfastTitle(event.target.value)}
                            onBlur={(event) =>
                                handleEntryBlur(
                                    "BREAKFAST",
                                    breakfast?.title,
                                    event.currentTarget.value
                                )
                            }
                            disabled={breakfastDone}
                            className={`${breakfastDone ? "line-through" : ""}`}
                        />
                        <Button variant="secondary" size="icon"
                            onClick={() => markAsDone("BREAKFAST", breakfast?.title ?? "")}>
                            <Check />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Sun />
                        <Textarea
                            value={lunchTitle}
                            onChange={(event) => setLunchTitle(event.target.value)}
                            onBlur={(event) =>
                                handleEntryBlur(
                                    "LUNCH",
                                    lunch?.title,
                                    event.currentTarget.value
                                )
                            }
                            disabled={lunchDone}
                            className={`${lunchDone ? "line-through" : ""}`}
                        />
                        <Button variant="secondary" size="icon"
                            onClick={() => markAsDone("LUNCH", lunch?.title ?? "")}>
                            <Check />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Sunset />
                        <Textarea
                            value={dinnerTitle}
                            onChange={(event) => setDinnerTitle(event.target.value)}
                            onBlur={(event) =>
                                handleEntryBlur(
                                    "DINNER",
                                    dinner?.title,
                                    event.currentTarget.value
                                )
                            }
                            disabled={dinnerDone}
                            className={`${dinnerDone ? "line-through" : ""}`}
                        />
                        <Button variant="secondary" size="icon"
                            onClick={() => markAsDone("DINNER", dinner?.title ?? "")}>
                            <Check />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}