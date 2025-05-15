'use client'

import { useState } from 'react';
import { Menu, Package, Stethoscope, Syringe, Truck, ChevronDown } from 'lucide-react';

export default function List() {
    const [open, setOpen] = useState(false);
    const [inventoryOpen, setInventoryOpen] = useState(false);

    return (
        <>
            <aside className="hidden md:block w-[240px] h-screen bg-[#0c1322] border-r border-gray-700 p-4 sticky top-0">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Navigation</h2>
                    <nav className="space-y-2">
                        <div className="space-y-1">
                            <button
                                onClick={() => setInventoryOpen(!inventoryOpen)}
                                className="flex items-center justify-between w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
                            >
                                <div className="flex items-center">
                                    <Package className="w-5 h-5 mr-3" />
                                    Inventory
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${inventoryOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`space-y-1 overflow-hidden transition-all duration-200 ${inventoryOpen ? 'max-h-48' : 'max-h-0'}`}>
                                <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1">
                                    <Stethoscope className="w-5 h-5 mr-3" />
                                    Diagnostic
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1">
                                    <Syringe className="w-5 h-5 mr-3" />
                                    Surgical
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1">
                                    <Package className="w-5 h-5 mr-3" />
                                    Consumables
                                </a>
                            </div>
                        </div>
                        <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1">
                            <Truck className="w-5 h-5 mr-3" />
                            Orders/Delivery
                        </a>
                    </nav>
                </div>
            </aside>
            <button
                className="md:hidden fixed top-2 left-4 z-50 bg-[#0c1322] p-2 rounded-lg border border-gray-700 shadow"
                onClick={() => setOpen(true)}
                aria-label="Open navigation menu"
            >
                <Menu className="text-white w-6 h-6" />
            </button>
            <div className={`fixed inset-0 z-50 bg-black/60 flex transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <aside className={`w-64 bg-[#0c1322] h-full p-4 border-r border-gray-700 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                    <button
                        className="mb-4 text-gray-400 hover:text-white"
                        onClick={() => setOpen(false)}
                        aria-label="Close navigation menu"
                    >
                        ✕
                    </button>
                    <h2 className="text-xl font-semibold text-white mb-4">Navigation</h2>
                    <nav className="space-y-2">
                        <div className="space-y-1">
                            <button
                                onClick={() => setInventoryOpen(!inventoryOpen)}
                                className="flex items-center justify-between w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
                            >
                                <div className="flex items-center">
                                    <Package className="w-5 h-5 mr-3" />
                                    Inventory
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${inventoryOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`space-y-1 overflow-hidden transition-all duration-200 ${inventoryOpen ? 'max-h-48' : 'max-h-0'}`}>
                                <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1">
                                    <Stethoscope className="w-5 h-5 mr-3" />
                                    Diagnostic
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1">
                                    <Syringe className="w-5 h-5 mr-3" />
                                    Surgical
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1">
                                    <Package className="w-5 h-5 mr-3" />
                                    Consumables
                                </a>
                            </div>
                        </div>
                        <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1">
                            <Truck className="w-5 h-5 mr-3" />
                            Orders/Delivery
                        </a>
                    </nav>
                </aside>
                <div className="flex-1" onClick={() => setOpen(false)} />
            </div>
        </>
    )
}