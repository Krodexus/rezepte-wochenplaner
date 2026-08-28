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

export default function DayCard({ calcDay, entryList }: { calcDay: number, entryList: object }) {

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
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="flex gap-2">
                            <Sunrise />
                            <Input
                                id="morgens"
                                type="text"
                                placeholder="Müsli"
                            />
                            <Button variant="secondary" size="icon">
                                <Check />
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Sun />
                            <Input
                                id="mittags"
                                type="text"
                                placeholder="Senfeier"
                            />
                            <Button variant="secondary" size="icon">
                                <Check />
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Sunset />
                            <Input
                                id="abends"
                                type="text"
                                placeholder="Kartoffelauflauf"
                            />
                            <Button variant="secondary" size="icon">
                                <Check />
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}