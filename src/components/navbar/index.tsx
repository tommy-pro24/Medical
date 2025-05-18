'use client'

import Image from "next/image"

export default function Navbar() {

    return (
        <nav className="sticky top-0 z-50 bg-[#111827] py-3 shadow border-b border-gray-700">
            <div className="container mx-auto h-full px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                    <Image src="/imgs/icons/logo.png" alt="Logo" width={32} height={32} />
                    <h1 className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap">Medical Dashboard</h1>
                </div>
            </div>
        </nav>
    )
}