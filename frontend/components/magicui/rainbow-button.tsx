
import React from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export function RainbowButton({
    children,
    className,
    ...props
}: RainbowButtonProps) {
    return (
        <button
            className={cn(
                "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-white transition-colors bg-teal-500 bg-rainbow-gradient focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
