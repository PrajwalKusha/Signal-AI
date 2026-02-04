
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
                "group relative inline-flex h-11 items-center justify-center rounded-xl p-[2px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <span className="absolute inset-0 -z-10 animate-rainbow bg-gradient-to-r from-[#00C9FF] via-[#92FE9D] to-[#00C9FF] bg-[length:200%] opacity-70 transition-opacity group-hover:opacity-100 rounded-xl" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 px-8 py-2 font-medium text-white backdrop-blur-3xl">
                {children}
            </span>
        </button>
    );
}
