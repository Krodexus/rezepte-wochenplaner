"use client";

import { Button } from "@/components/ui/button";
import { Square, SquareCheckBig, Sunrise, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { PlannerEntry } from "@/generated/browser";
import { upsertPlannerEntryAction, deletePlannerEntryAction } from "@/lib/actions/planner";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { upsertEntrySchema } from "@/lib/validations/plannerEntry";

type DayCardRowProps = {
    mealType: "BREAKFAST" | "LUNCH" | "DINNER",
    position: number,
    entry: PlannerEntry | null
}

export default function DayCardRow({ mealType, position, entry }: DayCardRowProps) {

    const [title, setTitle] = useState(entry?.title ?? "");
    const [isDone, setIsDone] = useState(entry?.isDone ?? false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // check if field has new title, changed title, or cleared title, then update accordingly
    async function handleEntryBlur(
        currentTitle: string
    ) {
        setErrorMessage(null);

        const parsedResult = upsertEntrySchema.safeParse({
            day: position,
            mealType,
            title: currentTitle,
            isDone: false
        })

        if (!parsedResult.success) {
            setErrorMessage(parsedResult.error.issues[0].message ?? "Ungültige Eingabe.");
            return;
        }

        const title = currentTitle.trim();
        const persistedTitle = entry?.title ?? "";

        // if nothing changed, do nothing
        if (title === persistedTitle) {
            return;
        }

        // if field got cleared, delete entry
        if (title === "") {
            if (!entry?.title) {
                return;
            }

            await deletePlannerEntryAction({
                day: position, mealType
            });
            return;
        }

        // if new entry/change, upsert field
        const result = await upsertPlannerEntryAction({
            day: position,
            mealType,
            title,
            isDone: false
        })

        if (!result.success) {
            setErrorMessage(result.error ?? "Ungültige Eingabe.");
        }
    }

    // mark meals as done
    async function markAsDone() {
        setIsDone(!isDone);

        await upsertPlannerEntryAction({
            day: position,
            mealType,
            title,
            isDone: !isDone
        })
    }

    return (
        <InputGroup className={`min-h-10 md:min-h-12 ${isDone ? "bg-muted" : "bg-white"}`}>
            {errorMessage && (<p role="alert" aria-live="polite" className="text-xs text-red-600">{errorMessage}</p>)}
            <InputGroupInput
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={(event) => handleEntryBlur(event.currentTarget.value)}
                disabled={isDone}
                maxLength={100}
                className={`text-md md:text-lg ${isDone ? "line-through text-gray-400" : ""}`}
            />
            <InputGroupAddon>
                {mealType == "BREAKFAST" ?
                    <Sunrise className={`md:size-5 ${isDone ? "text-gray-300" : ""}`} />
                    : mealType == "LUNCH" ?
                        <Sun className={`md:size-5 ${isDone ? "text-gray-300" : ""}`} />
                        :
                        <Moon className={`md:size-5 ${isDone ? "text-gray-300" : ""}`} />
                }
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
                <Button className={`hover:bg-green ${isDone ? "" : ""}`} variant="ghost" size="icon"
                    onClick={markAsDone}>
                    {isDone ? <SquareCheckBig className="md:size-5" /> : <Square className="md:size-5"/>}
                </Button>
            </InputGroupAddon>
        </InputGroup>
    )
}