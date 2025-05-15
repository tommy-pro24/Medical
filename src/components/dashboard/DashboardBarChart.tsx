"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { TooltipProps } from "recharts";

const data = [
    { name: "Jan", direct: 120, indirect: 85 },
    { name: "Feb", direct: 160, indirect: 110 },
    { name: "Mar", direct: 140, indirect: 95 },
    { name: "Apr", direct: 170, indirect: 120 },
    { name: "May", direct: 190, indirect: 125 },
    { name: "Jun", direct: 130, indirect: 85 },
    { name: "Jul", direct: 200, indirect: 140 }
];

// Custom tooltip for dark theme
const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#181f2a] border border-[#2a3344] rounded-lg px-4 py-2 shadow-lg">
                <p className="text-xs text-[#ffffff7c] mb-1">{label}</p>
                {payload.map((entry, idx) => (
                    <p key={idx} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DashboardBarChart() {
    return (
        <div className="w-full rounded-2xl bg-[#181f2a] p-6 shadow-lg border border-[#232b38]">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">Overview</h3>
                    <p className="text-xs text-[#ffffff7c]">Monthly Earning</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-gradient-to-tr from-blue-500 to-blue-400"></div>
                        <span className="text-xs text-[#b3c2e6]">Direct</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-gradient-to-tr from-cyan-400 to-cyan-300"></div>
                        <span className="text-xs text-[#b3c2e6]">Indirect</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        barGap={8}
                        margin={{
                            top: 20,
                            right: 0,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#b3c2e6', fontSize: 13, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#b3c2e6', fontSize: 13, fontWeight: 500 }}
                            dx={-10}
                        />
                        <Tooltip content={CustomTooltip} cursor={{ fill: "#232b38", opacity: 0.2 }} />
                        <Bar
                            dataKey="direct"
                            name="Direct"
                            fill="url(#directGradient)"
                            radius={[6, 6, 0, 0]}
                            barSize={16}
                        />
                        <Bar
                            dataKey="indirect"
                            name="Indirect"
                            fill="url(#indirectGradient)"
                            radius={[6, 6, 0, 0]}
                            barSize={16}
                        />
                        <defs>
                            <linearGradient id="directGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#4880FF" />
                                <stop offset="100%" stopColor="#3b6fd8" />
                            </linearGradient>
                            <linearGradient id="indirectGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1CE7FF" />
                                <stop offset="100%" stopColor="#0fc9e7" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}