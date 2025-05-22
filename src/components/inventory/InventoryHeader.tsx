import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, ShoppingCart, History } from 'lucide-react';
import Link from 'next/link';

interface InventoryHeaderProps {
    search: string;
    setSearch: (v: string) => void;
    currentUserRole: string;
    onAddProduct: () => void;
    onOrder: () => void;
    orderDisabled: boolean;
    selectedProductsCount: number;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
    search,
    setSearch,
    currentUserRole,
    onAddProduct,
    onOrder,
    orderDisabled,
    selectedProductsCount,
}) => (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            {currentUserRole !== 'client' && (
                <Button variant="outline" asChild>
                    <Link href="/histories" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        View History
                    </Link>
                </Button>
            )}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    className="pl-10 w-full"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            {currentUserRole === 'admin' && (
                <Button onClick={onAddProduct} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                </Button>
            )}
            {currentUserRole === 'client' && (
                <Button
                    onClick={onOrder}
                    className="w-full sm:w-auto"
                    disabled={orderDisabled}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order ({selectedProductsCount})
                </Button>
            )}
        </div>
    </div>
);

export default InventoryHeader; 