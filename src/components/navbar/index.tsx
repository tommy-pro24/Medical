'use client'

import Image from "next/image"
import { useState } from "react";

export default function Navbar() {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");

    return (
        <nav className="sticky top-0 z-50 bg-[#111827] py-3 shadow border-b border-gray-700">
            <div className="container mx-auto h-full px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                    <Image src="/imgs/icons/logo.png" alt="Logo" width={32} height={32} />
                    <h1 className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap">Medical Dashboard</h1>
                </div>
                <div className="flex items-center w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
                    <div className="relative flex justify-center items-center w-full sm:w-auto"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    >
                        <input
                            type="text"
                            className={`bg-[#1f2d4d] h-8 px-5 pr-10 rounded-full text-sm focus:outline-none transition-all duration-300 ease-in-out w-full sm:w-auto ${isFocused || value ? "sm:w-64" : "sm:w-5"
                                }`}
                            placeholder="Search..."
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <button type="submit" className="absolute right-2">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}