/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TotalBox(props: any) {
    // Data for each card
    return (
        <div className="w-full space-y-6">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-2 md:p-6">
                {props?.cards.map((card: any) => {
                    // Determine styles based on card title
                    const getCardStyles = (title: string) => {
                        switch (title.toLowerCase()) {
                            case "total products":
                                return {
                                    border: "border border-blue-900/60",
                                    bg: "bg-blue-900/30",
                                    accent: "text-blue-300",
                                    icon: "text-blue-300",
                                    title: "text-blue-200",
                                    desc: "text-blue-200/70"
                                };
                            case "low stock alert":
                                return {
                                    border: "border border-yellow-700/60",
                                    bg: "bg-yellow-900/20",
                                    accent: "text-yellow-300",
                                    icon: "text-yellow-300",
                                    title: "text-yellow-200",
                                    desc: "text-yellow-200/70"
                                };
                            case "stock in":
                                return {
                                    border: "border border-emerald-900/60",
                                    bg: "bg-emerald-900/20",
                                    accent: "text-emerald-300",
                                    icon: "text-emerald-300",
                                    title: "text-emerald-200",
                                    desc: "text-emerald-200/70"
                                };
                            case "stock out":
                                return {
                                    border: "border border-rose-900/60",
                                    bg: "bg-rose-900/20",
                                    accent: "text-rose-300",
                                    icon: "text-rose-300",
                                    title: "text-rose-200",
                                    desc: "text-rose-200/70"
                                };
                            case "pending":
                                return {
                                    border: "border border-orange-900/60",
                                    bg: "bg-orange-900/20",
                                    accent: "text-orange-300",
                                    icon: "text-orange-300",
                                    title: "text-orange-200",
                                    desc: "text-orange-200/70"
                                };
                            case "dispatched":
                                return {
                                    border: "border border-purple-900/60",
                                    bg: "bg-purple-900/20",
                                    accent: "text-purple-300",
                                    icon: "text-purple-300",
                                    title: "text-purple-200",
                                    desc: "text-purple-200/70"
                                };
                            case "in-transit":
                                return {
                                    border: "border border-blue-900/60",
                                    bg: "bg-blue-900/20",
                                    accent: "text-blue-300",
                                    icon: "text-blue-300",
                                    title: "text-blue-200",
                                    desc: "text-blue-200/70"
                                };
                            case "confirmed":
                                return {
                                    border: "border border-emerald-900/60",
                                    bg: "bg-emerald-900/20",
                                    accent: "text-emerald-300",
                                    icon: "text-emerald-300",
                                    title: "text-emerald-200",
                                    desc: "text-emerald-200/70"
                                };
                            case "cancelled":
                                return {
                                    border: "border border-rose-900/60",
                                    bg: "bg-rose-900/20",
                                    accent: "text-rose-300",
                                    icon: "text-rose-300",
                                    title: "text-rose-200",
                                    desc: "text-rose-200/70"
                                };
                            default:
                                return {
                                    border: "border border-white/10",
                                    accent: "text-white",
                                    icon: "text-white",
                                    title: "text-white",
                                    desc: "text-[#ffffff7c]"
                                };
                        }
                    };

                    const style = getCardStyles(card.title);
                    return (
                        <div
                            key={card.title}
                            className={`rounded-lg ${style.border} ${style.bg} cursor-pointer shadow-md flex flex-col p-4 md:p-6 transition-all hover:scale-[1.02] duration-200`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h3 className={`text-sm font-semibold ${style.accent}`}>{card.title}</h3>
                                <div className={style.icon}>
                                    <card.Icon />
                                </div>
                            </div>
                            <div className="mt-auto">
                                <p className={`text-lg md:text-2xl font-bold ${style.accent}`}>{card.value}</p>
                                <p className={`text-xs mt-2 ${style.desc}`}>{card.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}