'use client'

import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { PaginatedItems } from '@/components/histories/PaginatedItems';
import { Plus, Pencil, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { InventoryHistory } from '@/types';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { request } from '@/lib/request';
import HistoryHeader from '@/components/histories/HistoryHeader';
import HistoryTable from '@/components/histories/HistoryTable';
import HistoryCardList from '@/components/histories/HistoryCardList';

const InventoryHistoryPage = () => {
    const { getCurrentUser, setHistories, getInventoryHistory } = useData();
    const [search, setSearch] = useState('');
    const inventoryHistory = getInventoryHistory();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });

    useEffect(() => {
        if (getCurrentUser() && date?.from && date?.to) {
            getHistoryies();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrentUser(), date]);

    const getHistoryies = async () => {
        try {
            const response = await request({
                method: "POST",
                url: '/history/getHistories',
                data: { from: date?.from, to: date?.to },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            });
            if (response) setHistories(response);
        } catch (error) { console.log(error); }
    };

    // Filter and sort
    const filteredHistory = inventoryHistory.filter(entry =>
        entry.productName.toLowerCase().includes(search.toLowerCase()) ||
        entry.userName.toLowerCase().includes(search.toLowerCase()) ||
        entry.actionType.toLowerCase().includes(search.toLowerCase())
    );
    const sortedHistory = [...filteredHistory].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Badge and stock change utils
    const getActionBadge = (action: InventoryHistory['actionType']) => {
        switch (action) {
            case 'new':
                return { variant: 'default', icon: <Plus className="h-3 w-3 mr-1" />, label: 'Added' };
            case 'update':
                return { variant: 'secondary', icon: <Pencil className="h-3 w-3 mr-1" />, label: 'Updated' };
            case 'delete':
                return { variant: 'destructive', icon: <Trash className="h-3 w-3 mr-1" />, label: 'Deleted' };
            case 'stock-in':
                return { variant: 'outline', icon: <ArrowUp className="h-3 w-3 mr-1 text-green-500" />, label: 'Stock In' };
            case 'stock-out':
                return { variant: 'outline', icon: <ArrowDown className="h-3 w-3 mr-1 text-amber-500" />, label: 'Stock Out' };
            default:
                return { variant: 'outline', icon: null, label: action };
        }
    };
    const formatStockChange = (entry: InventoryHistory) => {
        const oldStock = entry.details.oldValue?.stockLevel;
        const newStock = entry.details.newValue?.stockLevel;
        if (oldStock !== undefined && newStock !== undefined) {
            const change = newStock - oldStock;
            const isIncrease = change > 0;
            return (
                <div className="flex items-center">
                    <span>{oldStock}</span>
                    <span className="mx-2">→</span>
                    <span>{newStock}</span>
                    <span className={`ml-2 ${isIncrease ? 'text-green-500' : 'text-amber-500'}`}>{isIncrease ? '+' : ''}{change}</span>
                </div>
            );
        }
        if (newStock !== undefined) return <span>{newStock}</span>;
        if (oldStock !== undefined) return <span>{oldStock}</span>;
        return <span>-</span>;
    };

    // Render paginated items
    const renderHistoryItems = (historyItems: InventoryHistory[]) => (
        <>
            <HistoryTable
                historyItems={historyItems}
                getActionBadge={getActionBadge}
                formatStockChange={formatStockChange}
            />
            <HistoryCardList
                historyItems={historyItems}
                getActionBadge={getActionBadge}
                formatStockChange={formatStockChange}
            />
        </>
    );

    return (
        <div className="space-y-6 w-full px-4 xl:px-6 md:px-10">
            <HistoryHeader search={search} setSearch={setSearch} date={date} setDate={setDate} />
            <div className="overflow-x-auto">
                <PaginatedItems
                    items={sortedHistory}
                    itemsPerPage={10}
                    renderItems={renderHistoryItems}
                />
            </div>
        </div>
    );
};

export default InventoryHistoryPage;
