import Link from "next/link";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldSeparator,
} from "@/components/ui/field"

export default function AuthLayout({ children }: LayoutProps<"/">) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 w-full">
            <div className="w-full max-w-sm md:max-w-5xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid md:min-h-170 p-0 md:grid-cols-2">
                            <div className="flex justify-center items-center p-6 md:p-8">
                                {children}
                            </div>
                            <div className="relative hidden bg-muted md:block">
                                <img
                                    src="/preview.png"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <FieldDescription className="px-6 text-center">
                        Durch die Nutzung stimmst du unseren <a href="#">AGB</a>{" "}
                        und <a href="#">Datenschutzbestimmungen</a> zu.
                    </FieldDescription>
                </div>
            </div>
        </div>
    );
}
