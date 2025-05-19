import LowProducts from "../ui/lowProducts";
import Orders from "../ui/orders";
import TotalProduct from "../ui/totalProduct";
import Transit from "../ui/transit";

export default function TotalBox() {
    // Color palette for a modern dark dashboard
    const cardStyles = [
        {
            border: "border border-white/10",
            accent: "text-white",
            icon: "text-white",
            title: "text-white",
            desc: "text-[#ffffff7c]"
        },
        {
            border: "border border-yellow-400/10",
            bg: "bg-yellow-400/5 backdrop-blur-sm",
            accent: "text-yellow-300",
            icon: "text-yellow-200",
            title: "text-yellow-100",
            desc: "text-yellow-200/80"
        },
        {
            border: "border border-white/10",
            accent: "text-white",
            icon: "text-white",
            title: "text-white",
            desc: "text-[#ffffff7c]"
        },
        {
            border: "border border-white/10",
            accent: "text-white",
            icon: "text-white",
            title: "text-white",
            desc: "text-[#ffffff7c]"
        },
        {
            border: "border border-green-400/10",
            bg: "bg-green-400/5 backdrop-blur-sm",
            accent: "text-green-300",
            icon: "text-green-200",
            title: "text-green-100",
            desc: "text-green-200/80"
        }
    ];

    // Data for each card
    const cards = [
        {
            title: "Total Products",
            value: "5 types, 35 pieces",
            desc: "Items in inventory",
            Icon: TotalProduct,
            style: 0
        },
        {
            title: "Low Stock Alert",
            value: "5 types",
            desc: "Items need restock",
            Icon: LowProducts,
            style: 1
        },
        {
            title: "Pending",
            value: "5",
            desc: "Awaiting processing",
            Icon: Orders,
            style: 2
        },
        {
            title: "In Transit",
            value: "5",
            desc: "Currently in delivery",
            Icon: Transit,
            style: 3
        },
        {
            title: "Pending1",
            value: "5",
            desc: "Completed deliveries",
            Icon: Orders,
            style: 4
        }
    ];

    return (
        <div className="w-full space-y-6">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-2 md:p-6">
                {cards.map((card) => {
                    const style = cardStyles[card.style];
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