"use client";

import { Button } from "@/components/ui/button";
import { Square, SquareCheckBig, Sunrise, Sun, Moon, GripVertical } from "lucide-react";
import { PlannerEntry } from "@/generated/browser";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { useDraggable, useDroppable } from "@dnd-kit/react"
import type { EntryChanges, MealType } from "./planner";

type DayCardRowProps = {
    mealType: MealType,
    position: number,
    entry: PlannerEntry | null,
    error?: string,
    onLocalChangeAction: (day: number, mealType: MealType, changes: EntryChanges) => void,
    onCommitAction: (day: number, mealType: MealType, changes: EntryChanges) => void,
}

export default function DayCardRow({ mealType, position, entry, error, onLocalChangeAction, onCommitAction }: DayCardRowProps) {

    // make rows draggable and droppable
    const { ref: dragRef, isDragging } = useDraggable({
        id: `${position}-${mealType}`,
        data: { day: position, mealType, entry },
    })

    const { ref: dropRef, isDropTarget } = useDroppable({
        id: `${position}-${mealType}`,
        data: { day: position, mealType },
    })

    return (
        // dim the source row while dragging, lift rows currently hovered over as a drop target
        <div ref={(el) => {
            dragRef(el);
            dropRef(el);
        }} className={`transition-transform duration-150 ${isDragging ? "opacity-30" : ""} ${isDropTarget ? "-translate-y-1 translate-x-2 shadow-md" : ""}`}>
            <InputGroup className={`min-h-10 md:min-h-12 ${entry?.isDone ? "bg-muted" : "bg-white"}`}>
                {error && (<p role="alert" aria-live="polite" className="text-xs text-red-600">{error}</p>)}
                <InputGroupInput
                    value={entry?.title ?? ""}
                    onChange={(event) => onLocalChangeAction(position, mealType, { title: event.target.value })}
                    onBlur={(event) => onCommitAction(position, mealType, { title: event.currentTarget.value })}
                    disabled={!!entry?.isDone}
                    maxLength={100}
                    className={`text-md md:text-lg ${entry?.isDone ? "line-through text-gray-400" : ""}`}
                />
                <InputGroupAddon>
                    {mealType == "BREAKFAST" ?
                        <Sunrise className={`size-4 md:size-5 ${entry?.isDone ? "text-gray-300" : ""}`} />
                        : mealType == "LUNCH" ?
                            <Sun className={`size-4 md:size-5 ${entry?.isDone ? "text-gray-300" : ""}`} />
                            :
                            <Moon className={`size-4 md:size-5 ${entry?.isDone ? "text-gray-300" : ""}`} />
                    }
                </InputGroupAddon>
                <InputGroupAddon align="inline-end" className="gap-0 md:gap-2 pr-3 md:pr-4">
                    <Button className={`${entry?.isDone ? "" : ""}`} variant="ghost" size="icon-sm"
                        onClick={() => {
                            const isDone = !entry?.isDone;
                            onLocalChangeAction(position, mealType, { isDone });
                            onCommitAction(position, mealType, { isDone });
                        }}>
                        {entry?.isDone ? <SquareCheckBig className="size-4 md:size-5" /> : <Square className="size-4 md:size-5" />}
                    </Button>
                    <div className="py-2 flex justify-center items-center rounded-lg hover:bg-gray-100 cursor-grab">
                        <GripVertical className="size-4 md:size-5" />
                    </div>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}

type DayCardRowPreviewProps = {
    mealType: MealType;
    entry: PlannerEntry | null;
};

// static visual clone rendered inside the DragOverlay, matching DayCardRow's markup exactly
export function DayCardRowPreview({ mealType, entry }: DayCardRowPreviewProps) {
    return (
        <InputGroup className={`min-h-10 md:min-h-12 shadow-lg ${entry?.isDone ? "bg-muted" : "bg-white"}`}>
            <InputGroupInput
                value={entry?.title ?? ""}
                readOnly
                className={`text-md md:text-lg ${entry?.isDone ? "line-through text-gray-400" : ""}`}
            />
            <InputGroupAddon>
                {mealType == "BREAKFAST" ?
                    <Sunrise className={`size-4 md:size-5 ${entry?.isDone ? "text-gray-300" : ""}`} />
                    : mealType == "LUNCH" ?
                        <Sun className={`size-4 md:size-5 ${entry?.isDone ? "text-gray-300" : ""}`} />
                        :
                        <Moon className={`size-4 md:size-5 ${entry?.isDone ? "text-gray-300" : ""}`} />
                }
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="gap-0 md:gap-2 pr-3 md:pr-4">
                <Button variant="ghost" size="icon-sm" tabIndex={-1}>
                    {entry?.isDone ? <SquareCheckBig className="size-4 md:size-5" /> : <Square className="size-4 md:size-5" />}
                </Button>
                <div className="py-2 flex justify-center items-center rounded-lg">
                    <GripVertical className="size-4 md:size-5" />
                </div>
            </InputGroupAddon>
        </InputGroup>
    )
}