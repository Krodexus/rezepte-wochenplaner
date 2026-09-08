"use client"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GlassButton from "./navbarButton"

import { useState } from "react"
import type { ReactElement } from "react"
import { updatePlannerAction, deleteAllPlannerEntriesAction } from "@/lib/actions/planner"
import { updatePlannerSchema } from "@/lib/validations/planner";


type SettingsDialogProps = {
    icon: ReactElement,
    plannerData: {
        startDay: number,
        length: number,
    }
}

export function SettingsDialog({ icon, plannerData }: SettingsDialogProps) {

    const [startDay, setStartDay] = useState(plannerData.startDay);
    const [length, setLength] = useState(plannerData.length.toString());

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)

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

    async function handleSubmit() {
        setIsLoading(true);
        setErrorMessage(null);

        const result = updatePlannerSchema.safeParse({
            startDay: Number(startDay),
            length: Number(length),
        })

        if (!result.success) {
            setErrorMessage(result.error.issues[0].message)
            setIsLoading(false);
            return;
        }

        if (plannerData.startDay === startDay && plannerData.length === Number(length)) {
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        await updatePlannerAction(result.data);
        setIsOpen(false);
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={<GlassButton icon={icon} />} />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Listeneinstellungen</DialogTitle>
                    <DialogDescription>
                        Hier kannst du den Starttag und die Länge der Liste einstellen.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <Label htmlFor="startDay">Starttag</Label>
                        <Select items={weekdays} value={startDay} onValueChange={(event) => setStartDay(Number(event))}>
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
                    </Field>
                    <Field>
                        <Label htmlFor="length">Länge</Label>
                        <Input id="length" name="length" type="number" max={28} value={length} onChange={(event) => setLength(event.target.value)}></Input>
                        {errorMessage && (<p role="alert" aria-live="polite" className="text-sm text-red-600">{errorMessage}</p>)}
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline">Schließen</Button>} />
                    <Button onClick={handleSubmit}>{isLoading ? "Wird gespeichert" : "Speichern"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

type ProfileDialogProps = {
    icon: ReactElement,
}

export function ProfileDialog({ icon }: ProfileDialogProps) {
    return (
        <Dialog>
            <form>
                <DialogTrigger render={<GlassButton icon={icon} />} />
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Username</Label>
                            <Input id="username-1" name="username" defaultValue="@peduarte" />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

type DeleteDialogProps = {
    icon: ReactElement,
}

export function DeleteDialog({ icon }: DeleteDialogProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleSubmit() {
        setIsLoading(true);
        const result = await deleteAllPlannerEntriesAction()
        
        if (result.success) {
            setIsOpen(false);
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger render={<GlassButton icon={icon}/>} />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Möchtest du alle Einträge löschen?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Diese Aktion kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>{isLoading ? "Wird gelöscht" : "Alle Einträge löschen"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}