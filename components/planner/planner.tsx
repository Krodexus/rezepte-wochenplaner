"use client";

import { useMemo, useState, useOptimistic, startTransition } from "react";
import DayCard from "@/components/planner/dayCard";
import { DayCardRowPreview } from "@/components/planner/dayCardRow";
import type { PlannerEntry } from "@/generated/browser";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { upsertPlannerEntryAction, deletePlannerEntryAction, swapPlannerEntriesAction } from "@/lib/actions/planner";
import { upsertEntrySchema } from "@/lib/validations/plannerEntry";

type PlannerData = {
    startDay: number,
    length: number,
}

type PlannerProps = {
    entryList: PlannerEntry[];
    plannerData: PlannerData;
};

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";
export type EntryChanges = Partial<Pick<PlannerEntry, "title" | "comment" | "isDone">>;

type EntryAction =
    | { type: "update"; day: number; mealType: MealType; changes: EntryChanges }
    | { type: "swap"; source: { day: number; mealType: MealType }; target: { day: number; mealType: MealType } };

// uncommitted per-field edits (typing) layered on top of the optimistic/server state
type Draft = EntryChanges & { day: number; mealType: MealType };

function entryKey(day: number, mealType: MealType) {
    return `${day}-${mealType}`;
}

// merges a confirmed change into the last known server state (entryList)
function entriesReducer(state: PlannerEntry[], action: EntryAction): PlannerEntry[] {
    if (action.type === "swap") {
        const { source, target } = action;
        return state.map((entry) => {
            if (entry.day === source.day && entry.mealType === source.mealType) {
                return { ...entry, day: target.day, mealType: target.mealType };
            }
            if (entry.day === target.day && entry.mealType === target.mealType) {
                return { ...entry, day: source.day, mealType: source.mealType };
            }
            return entry;
        });
    }

    const { day, mealType, changes } = action;
    const exists = state.some((entry) => entry.day === day && entry.mealType === mealType);

    if (!exists) {
        const newEntry: PlannerEntry = {
            id: entryKey(day, mealType),
            plannerId: "",
            day,
            mealType,
            title: "",
            comment: null,
            isDone: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...changes,
        };
        return [...state, newEntry];
    }

    return state.map((entry) =>
        entry.day === day && entry.mealType === mealType
            ? { ...entry, ...changes }
            : entry
    );
}

export default function Planner({ entryList, plannerData }: PlannerProps) {

    // entryList (server prop) is the source of truth; addOptimisticEntry only overlays it while a commit is pending
    const [entries, addOptimisticEntry] = useOptimistic(entryList, entriesReducer);
    // uncommitted typing, keyed by day-mealType; cleared once a commit succeeds
    const [drafts, setDrafts] = useState<Record<string, Draft>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    // entries with any in-progress typing layered on top, for rendering only
    const displayEntries = useMemo(() => {
        const merged = entries.map((entry) => {
            const draft = drafts[entryKey(entry.day, entry.mealType)];
            return draft ? { ...entry, ...draft } : entry;
        });

        for (const [key, draft] of Object.entries(drafts)) {
            if (!merged.some((entry) => entryKey(entry.day, entry.mealType) === key)) {
                merged.push({
                    id: key,
                    plannerId: "",
                    title: "",
                    comment: null,
                    isDone: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    ...draft,
                });
            }
        }

        return merged;
    }, [entries, drafts]);

    // updates the UI only, e.g. while typing - no server/optimistic involvement yet
    function updateLocalEntry(day: number, mealType: MealType, changes: EntryChanges) {
        const key = entryKey(day, mealType);
        setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], day, mealType, ...changes } }));
    }

    // persists changes to the server; only now does the optimistic state kick in (e.g. onBlur, isDone toggle)
    function commitEntry(day: number, mealType: MealType, changes: EntryChanges) {
        const key = entryKey(day, mealType);
        const current = displayEntries.find((entry) => entry.day === day && entry.mealType === mealType);

        // nothing typed and not an explicit isDone toggle -> nothing to commit
        if (!(key in drafts) && changes.isDone === undefined) { return }

        const merged = { ...current, ...changes };
        const title = (merged.title ?? "").trim();

        const parsedResult = upsertEntrySchema.safeParse({
            day,
            mealType,
            title,
            isDone: merged.isDone ?? false,
        });

        // error message: keep the draft visible so the user can fix it
        if (!parsedResult.success) {
            setErrors((prev) => ({ ...prev, [key]: parsedResult.error.issues[0].message ?? "Ungültige Eingabe." }));
            return;
        }

        setErrors((prev) => {
            if (!(key in prev)) return prev;
            const { [key]: _removed, ...rest } = prev;
            return rest;
        });

        startTransition(async () => {
            // hand the confirmed value to the optimistic layer and drop the draft in the same tick
            addOptimisticEntry({
                type: "update",
                day,
                mealType,
                changes: { title, comment: merged.comment ?? null, isDone: merged.isDone ?? false },
            });
            setDrafts((prev) => {
                if (!(key in prev)) return prev;
                const { [key]: _removed, ...rest } = prev;
                return rest;
            });

            if (title === "" && !merged.comment && merged.isDone === false) {
                await deletePlannerEntryAction({ day, mealType });
                return;
            }

            const result = await upsertPlannerEntryAction({
                day,
                mealType,
                title,
                comment: merged.comment ?? undefined,
                isDone: merged.isDone ?? false,
            });

            if (!result.success) {
                setErrors((prev) => ({ ...prev, [key]: result.error ?? "Ungültige Eingabe." }));
            }
        });
    }

    return (
        <DragDropProvider
            onDragEnd={({ operation }) => {
                const source = operation.source?.data as { day: number; mealType: MealType } | undefined;
                const target = operation.target?.data as { day: number, mealType: MealType } | undefined;
                if (!source || !target || (source.day === target.day && source.mealType === target.mealType)) return;

                startTransition(async () => {
                    addOptimisticEntry({ type: "swap", source, target });

                    const result = await swapPlannerEntriesAction({ source, target });

                    if (!result.success) {
                        setErrors((prev) => ({ ...prev, drag: result.error ?? "Verschieben fehlgeschlagen." }));
                    }
                });
            }}
        >
            <div className="w-full flex justify-center pt-15 md:pt-0">
                <div className="flex flex-col justify-center items-center p-5 w-full max-w-3xl gap-5">
                    {Array.from({ length: Number(plannerData.length) }).map((_, index) => {
                        const day = index + 1;

                        return (
                            <DayCard
                                key={day}
                                position={index + 1}
                                calcDay={Number(plannerData.startDay) + index}
                                entries={displayEntries.filter((entry) => entry.day === day)}
                                errors={errors}
                                onLocalChangeAction={updateLocalEntry}
                                onCommitAction={commitEntry}
                            />
                        );
                    })}
                </div>
            </div>
            <DragOverlay dropAnimation={{duration: 200, easing: "ease"}}>
                {(source) => {
                    const { mealType, entry } = source.data as { day: number; mealType: MealType; entry: PlannerEntry | null };
                    return <DayCardRowPreview mealType={mealType} entry={entry} />;
                }}
            </DragOverlay>
        </DragDropProvider>
    )
}