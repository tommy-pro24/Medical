import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NotificationBadgeProps {
    count: number;
    className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
    if (count === 0) return null;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1
            }}
            transition={{
                duration: 0.3,
                ease: "easeOut"
            }}
            className="relative"
        >
            <motion.span
                animate={{
                    boxShadow: [
                        "0 0 0 0 rgba(239, 68, 68, 0.4)",
                        "0 0 0 8px rgba(239, 68, 68, 0)"
                    ]
                }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className={cn(
                    "ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5 flex items-center justify-center",
                    "relative z-10",
                    className
                )}
            >
                {count}
            </motion.span>
        </motion.div>
    );
} 