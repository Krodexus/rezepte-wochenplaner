import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex resize-none field-sizing-content min-h-9 w-full bg-transparent px-2.5 py-2 text-xs md:text-sm transition-[color,box-shadow] outline-none border-b border-b-gray-300 placeholder:text-muted-foreground focus-visible:border-b-3 focus-visible:border-b-gray-400 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
