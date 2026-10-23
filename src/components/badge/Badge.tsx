import { cn } from "@/lib/utils";

type BadgeProps = {
    children: React.ReactNode;
    variant?: "outline" | "filled";
    className?: string;
};

export default function Badge({
    children,
    variant = "outline",
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "eyebrow inline-flex items-center rounded-full px-3 py-1.5 text-xs",
                {
                    "border border-secondary-foreground/25 text-secondary-foreground/75":
                        variant === "outline",
                    "bg-secondary-foreground text-secondary":
                        variant === "filled",
                },
                className
            )}
        >
            {children}
        </span>
    );
}
