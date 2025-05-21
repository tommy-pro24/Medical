import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NotificationBadgeProps {
    count: number;
    className?: string;
    variant?: 'orders' | 'inventory';
}

export function NotificationBadge({ count, className, variant = 'orders' }: NotificationBadgeProps) {
    if (count === 0) return null;

    const getBadgeStyles = () => {
        if (variant === 'orders') {
            return "bg-destructive text-white";
        }
        return "bg-amber-500/50 text-white";
    };

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
                    boxShadow: variant === 'orders'
                        ? [
                            "0 0 0 0 rgba(239, 68, 68, 0.4)",
                            "0 0 0 8px rgba(239, 68, 68, 0)"
                        ]
                        : [
                            "0 0 0 0 rgba(245, 158, 11, 0.4)",
                            "0 0 0 8px rgba(245, 158, 11, 0)"
                        ]
                }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className={cn(
                    "ml-auto text-xs rounded-full px-2 py-0.5 flex items-center text-white justify-center",
                    "relative z-10",
                    getBadgeStyles(),
                    className
                )}
            >
                {count}
            </motion.span>
        </motion.div>
    );
} 