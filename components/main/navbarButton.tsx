"use client";

import {
    forwardRef,
    type MouseEventHandler,
    type ReactElement,
} from "react";

type GlassButtonProps = {
    icon: ReactElement;
    action?: MouseEventHandler<HTMLButtonElement>;
} & Omit<React.ComponentPropsWithoutRef<"button">, "children" | "onClick">;

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ icon, action, type = "button", ...props }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                onClick={action}
                className="flex justify-center items-center h-12 w-12 rounded-full shadow-xl/15 border border-gray-400 backdrop-blur-xs backdrop-brightness-90 transition duration-200 hover:backdrop-brightness-80"
                {...props}
            >
                {icon}
            </button>
        );
    }
);

GlassButton.displayName = "GlassButton";

export default GlassButton;