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

export default async function LandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid md:min-h-170 p-0 md:grid-cols-2">
          <div className="flex justify-center items-center p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Willkommen beim Mahlzeiten-Planer</h1>
                <p className="text-balance text-muted-foreground">
                  Speichere deine geplanten Mahlzeiten übersichtlich in einer Liste ab und bearbeite sie jederzeit.<br />Der Planer ist <span className="font-bold">komplett kostenlos</span>.
                </p>
              </div>
              <Field>
                <Link className="h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 text-white bg-linear-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" href="/login">Login</Link>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                oder
              </FieldSeparator>
              <Link className="h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground" href="/register">Kostenloses Konto erstellen</Link>
            </FieldGroup>
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
  );
}
