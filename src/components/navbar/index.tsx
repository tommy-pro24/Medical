'use client'

import { LogOut } from "lucide-react"
import Image from "next/image"
import { useData } from "@/context/DataContext";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Navbar() {

    const router = useRouter();

    const { logout } = useData();

    const handleLogout = () => {

        logout(); Cookies.set('id', '');

        router.push('/login/siginin');

    };

    return (
        <nav className="sticky top-0 z-50 bg-[#111827] py-3 shadow border-b border-gray-700">
            <div className="container mx-auto h-full  px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 w-full  sm:w-auto justify-center sm:justify-start">
                    <Image src="/imgs/icons/logo.png" alt="Logo" width={32} height={32} />
                    <h1 className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap">Medical Dashboard</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                    Logout
                </button>
            </div>
        </nav>
    )
}