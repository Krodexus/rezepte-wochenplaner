"use server";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { getPlannerEntries } from "@/lib/db/planner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Planner() {

    // retrieve user entries
    async function getUserEntries() {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (session?.session.userId != null) {
            const entryList = getPlannerEntries(session.session.userId);
            return entryList;
        };

        return null;
    }

    const entries = getUserEntries();

    // weekday items for dropdown
    const items = [
        { label: "Montag", value: 1 },
        { label: "Dienstag", value: 2 },
        { label: "Mittwoch", value: 3 },
        { label: "Donnerstag", value: 4 },
        { label: "Freitag", value: 5 },
        { label: "Samstag", value: 6 },
        { label: "Sonntag", value: 7 },
    ]

    return (
        <div className="flex flex-col h-full justify-center items-center gap-5">
            <div className="">
                <Select items={items}>
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Starttag auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input id="length" type="number" placeholder="7"></Input>
            </div>
            <div>
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Montag</CardTitle>
                        <CardAction>
                            <Button variant="link">Einträge löschen</Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="morgens">Frühstück</Label>
                                    <Input
                                        id="morgens"
                                        type="text"
                                        placeholder="Müsli"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="mittags">Mittagessen</Label>
                                    <Input
                                        id="mittags"
                                        type="text"
                                        placeholder="Senfeier"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="abends">Abendessen</Label>
                                    <Input
                                        id="abends"
                                        type="text"
                                        placeholder="Kartoffelauflauf"
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}