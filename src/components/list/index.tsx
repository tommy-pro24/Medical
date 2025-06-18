'use client'

import { useState, useEffect } from 'react';
import { Menu, Package, Truck, ChevronDown, LayoutDashboard, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { NotificationBadge } from "../ui/notification-badge";
import { request } from "@/lib/request";

interface Category {
    _id: string;
    name: string;
    description?: string;
}

export default function List() {
    const [open, setOpen] = useState(false);
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const { getNewOrders, getCurrentUser, getProducts } = useData();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await request<Category[]>({
                url: '/category/getAllCategories',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            });
            setCategories(response.data);
        };
        if (getCurrentUser()) fetchCategories();
    }, [getCurrentUser]);

    const isActive = (path: string) => pathname === path;

    const products = getProducts();

    const getLowStockCount = (categoryId?: string) => {
        return products.filter(product =>
            product.stockNumber <= product.lowStockThreshold &&
            (!categoryId || product.category === categoryId)
        ).length;
    };

    const totalLowStock = getLowStockCount();

    const renderInventoryLinks = (isMobile = false) => (
        <div className={`space-y-1 ${isMobile ? 'ml-5' : 'ml-3'} overflow-hidden transition-all duration-200 ${inventoryOpen ? 'max-h-96' : 'max-h-0'}`}>
            <Link href="/inventory" className={`flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/inventory') ? 'bg-gray-700' : ''}`}>
                <div className='flex'>
                    <Package className="w-5 h-5 mr-3" />
                    All
                </div>
                {getCurrentUser()?.role !== 'client' &&
                    <NotificationBadge count={totalLowStock} variant="inventory" />
                }
            </Link>
            {categories && categories?.map((category) => (
                <Link
                    key={category._id}
                    href={`/inventory/${category._id}`}
                    className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive(`/inventory/${category._id}`) ? 'bg-gray-700' : ''}`}
                >
                    <div className='flex'>
                        <Package className="w-5 h-5 mr-3" />
                        {category.name}
                    </div>
                    {getCurrentUser()?.role !== 'client' &&
                        <NotificationBadge count={getLowStockCount(category._id)} variant="inventory" />
                    }
                </Link>
            ))}
        </div>
    );

    return (
        <>
            <aside className="hidden md:flex w-[240px] h-screen bg-[#0c1322] border-r border-gray-700 p-4 sticky top-0 flex-col">
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
                            {renderInventoryLinks()}
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
                        <Link href="/profile" className={`flex justify-between items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/profile') ? 'bg-gray-700' : ''}`}>
                            <div className='flex'>
                                <UserRound className="w-5 h-5 mr-3" />
                                Profile
                            </div>
                        </Link>
                        {getCurrentUser()?.role === 'admin' && (
                            <Link href="/categories" className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/categories') ? 'bg-gray-700' : ''}`}>
                                <Package className="w-5 h-5 mr-3" />
                                Manage Categories
                            </Link>
                        )}
                        {getCurrentUser()?.role === 'admin' && (
                            <Link href="/userManagement" className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/userManagement') ? 'bg-gray-700' : ''}`}>
                                <UserRound className="w-5 h-5 mr-3" />
                                User Management
                            </Link>
                        )}
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
                                {renderInventoryLinks(true)}
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
                            <Link href="/profile" className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/profile') ? 'bg-gray-700' : ''}`}>
                                <UserRound className="w-5 h-5 mr-3" />
                                Profile
                            </Link>
                            {getCurrentUser()?.role === 'admin' && (
                                <Link href="/categories" className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/categories') ? 'bg-gray-700' : ''}`}>
                                    <Package className="w-5 h-5 mr-3" />
                                    Manage Categories
                                </Link>
                            )}
                            {getCurrentUser()?.role === 'admin' && (
                                <Link href="/userManagement" className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:translate-x-1 ${isActive('/userManagement') ? 'bg-gray-700' : ''}`}>
                                    <UserRound className="w-5 h-5 mr-3" />
                                    User Management
                                </Link>
                            )}
                        </nav>
                    </div>
                </aside>
                <div className="flex-1" onClick={() => setOpen(false)} />
            </div>
        </>
    );
}