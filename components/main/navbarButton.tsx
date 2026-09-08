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
                className="flex justify-center items-center h-10 w-10 rounded-full border border-gray-400 backdrop-blur-xs backdrop-brightness-80 transition duration-200 hover:backdrop-brightness-60"
                {...props}
            >
                {icon}
            </button>
        );
    }
);

GlassButton.displayName = "GlassButton";

export default GlassButton;