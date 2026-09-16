"use client";

import DayCard from "@/components/planner/dayCard";
import type { PlannerEntry } from "@/generated/browser";

type PlannerData = {
    startDay: number,
    length: number,
}

type PlannerProps = {
    entryList: PlannerEntry[];
    plannerData: PlannerData;
};

export default function Planner({ entryList, plannerData }: PlannerProps) {

    return (
        <div className="flex flex-col justify-center items-center p-5">
            <div className="flex flex-col w-full max-w-2xl gap-5">
                {Array.from({ length: Number(plannerData.length) }).map((_, index) => {
                    const day = index + 1;

                    return (
                        <DayCard
                            key={day}
                            position={index + 1}
                            calcDay={Number(plannerData.startDay) + index}
                            entries={entryList.filter((entry) => entry.day === day)}
                        />
                    );
                })}
            </div>
        </div >
    )
}