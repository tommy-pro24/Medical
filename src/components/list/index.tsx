'use client'

import { useState } from 'react';
import { Menu, Package, Stethoscope, Syringe, Truck, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Cookies from 'js-cookie';
import { NotificationBadge } from "../ui/notification-badge";

export default function List() {

    const [open, setOpen] = useState(false);

    const [inventoryOpen, setInventoryOpen] = useState(false);

    const { logout, getNewOrders, getCurrentUser, getProducts } = useData();

    const pathname = usePathname();

    const router = useRouter();

    const handleLogout = () => {

        logout(); Cookies.set('id', '');

        router.push('/login/siginin');

    };

    const isActive = (path: string) => pathname === path;

    const products = getProducts();

    const getLowStockCount = (category?: string) => {
        return products.filter(product =>
            product.stockNumber <= product.lowStockThreshold &&
            (!category || product.category === category)
        ).length;
    };

    const totalLowStock = getLowStockCount();
    const diagnosticLowStock = getLowStockCount('diagnostic');
    const surgicalLowStock = getLowStockCount('surgical');
    const consumableLowStock = getLowStockCount('consumable');

    return (
        <>
            <aside className="hidden md:flex w-[240px] h-screen bg-[#0c1322] border-r border-gray-700 p-4 sticky top-0  flex-col">
                <div className="space-y-4 flex-grow">
                    <h2 className="text-xl font-semibold text-white mb-4">Navigation</h2>
                    <nav className="space-y-2">
                        <Link href="/" className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/') ? 'bg-gray-700' : ''}`}>
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>
                        <div className="space-y-1">
                            <button
                                onClick={() => {
                                    setInventoryOpen(!inventoryOpen);
                                    router.push('/inventory');
                                }}
                                className="flex items-center justify-between w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
                            >
                                <div className="flex items-center">
                                    <Package className="w-5 h-5 mr-3" />
                                    Inventory
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${inventoryOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`space-y-1 overflow-hidden ml-3 transition-all duration-200 ${inventoryOpen ? 'max-h-48' : 'max-h-0'}`}>
                                <Link href="/inventory" className={`flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory') ? 'bg-gray-700' : ''}`}>
                                    <div className='flex'>
                                        <Package className="w-5 h-5 mr-3" />
                                        All
                                    </div>
                                    {getCurrentUser()?.role !== 'client' &&
                                        <NotificationBadge count={totalLowStock} variant="inventory" />
                                    }
                                </Link>
                                <Link href="/inventory/diagnostic" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory/diagnostic') ? 'bg-gray-700' : ''}`}>
                                    <div className='flex'>
                                        <Stethoscope className="w-5 h-5 mr-3" />
                                        Diagnostic
                                    </div>
                                    {getCurrentUser()?.role !== 'client' &&
                                        <NotificationBadge count={diagnosticLowStock} variant="inventory" />
                                    }
                                </Link>
                                <Link href="/inventory/surgical" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory/surgical') ? 'bg-gray-700' : ''}`}>
                                    <div className=' flex'>
                                        <Syringe className="w-5 h-5 mr-3" />
                                        Surgical
                                    </div>
                                    {getCurrentUser()?.role !== 'client' &&
                                        <NotificationBadge count={surgicalLowStock} variant="inventory" />
                                    }
                                </Link>
                                <Link href="/inventory/consumable" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory/consumable') ? 'bg-gray-700' : ''}`}>
                                    <div className='flex'>
                                        <Package className="w-5 h-5 mr-3" />
                                        Consumables
                                    </div>
                                    {getCurrentUser()?.role !== 'client' &&
                                        <NotificationBadge count={consumableLowStock} variant="inventory" />
                                    }
                                </Link>
                            </div>
                        </div>
                        <Link href="/orders" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/orders') ? 'bg-gray-700' : ''}`}>
                            <div className='flex'>
                                <Truck className="w-5 h-5 mr-3" />
                                Orders/Delivery
                            </div>
                            {Number(getNewOrders()) > 0 &&
                                <NotificationBadge count={getNewOrders()} variant="orders" />
                            }
                        </Link>
                    </nav>
                </div>
                <div className="pt-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                        Logout
                    </button>
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
                <aside className={`w-64 bg-[#0c1322] h-full p-4 border-r border-gray-700 transition-transform duration-200 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                    <button
                        className="mb-4 text-gray-400 hover:text-white"
                        onClick={() => setOpen(false)}
                        aria-label="Close navigation menu"
                    >
                        ✕
                    </button>
                    <div className="flex-grow">
                        <h2 className="text-xl font-semibold text-white mb-4">Navigation</h2>
                        <nav className="space-y-2">
                            <Link href="/" className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/') ? 'bg-gray-700' : ''}`}>
                                <LayoutDashboard className="w-5 h-5 mr-3" />
                                Dashboard
                            </Link>
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        setInventoryOpen(!inventoryOpen);
                                        router.push('/inventory');
                                    }}
                                    className="flex items-center justify-between w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200"
                                >
                                    <div className="flex items-center">
                                        <Package className="w-5 h-5 mr-3" />
                                        Inventory
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${inventoryOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`space-y-1 ml-5 overflow-hidden transition-all duration-200 ${inventoryOpen ? 'max-h-48' : 'max-h-0'}`}>
                                    <Link href="/inventory" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory') ? 'bg-gray-700' : ''}`}>
                                        <div className='flex'>
                                            <Package className="w-5 h-5 mr-3" />
                                            All
                                        </div>
                                        {getCurrentUser()?.role !== 'client' &&
                                            <NotificationBadge count={totalLowStock} variant="inventory" />
                                        }
                                    </Link>
                                    <Link href="/inventory/diagnostic" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory/diagnostic') ? 'bg-gray-700' : ''}`}>
                                        <div className='flex'>
                                            <Stethoscope className="w-5 h-5 mr-3" />
                                            Diagnostic
                                        </div>
                                        {getCurrentUser()?.role !== 'client' &&
                                            <NotificationBadge count={diagnosticLowStock} variant="inventory" />
                                        }
                                    </Link>
                                    <Link href="/inventory/surgical" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory/surgical') ? 'bg-gray-700' : ''}`}>
                                        <div className='flex'>
                                            <Syringe className="w-5 h-5 mr-3" />
                                            Surgical
                                        </div>
                                        {getCurrentUser()?.role !== 'client' &&
                                            <NotificationBadge count={surgicalLowStock} variant="inventory" />
                                        }
                                    </Link>
                                    <Link href="/inventory/consumable" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory/consumable') ? 'bg-gray-700' : ''}`}>
                                        <div className='flex'>
                                            <Package className="w-5 h-5 mr-3" />
                                            Consumables
                                        </div>
                                        {getCurrentUser()?.role !== 'client' &&
                                            <NotificationBadge count={consumableLowStock} variant="inventory" />
                                        }
                                    </Link>
                                </div>
                            </div>
                            <Link href="/orders" className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/orders') ? 'bg-gray-700' : ''}`}>
                                <div className='flex'>
                                    <Truck className="w-5 h-5 mr-3" />
                                    Orders/Delivery
                                </div>
                                {Number(getNewOrders()) > 0 &&
                                    <NotificationBadge count={getNewOrders()} variant="orders" />
                                }
                            </Link>
                        </nav>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
                        >
                            <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                            Logout
                        </button>
                    </div>
                </aside>
                <div className="flex-1" onClick={() => setOpen(false)} />
            </div>
        </>
    )
}