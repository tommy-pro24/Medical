'use client'



import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginatedItems } from '@/components/histories/PaginatedItems';
import { Search, Package, ArrowUp, ArrowDown, Plus, Pencil, Trash } from 'lucide-react';
import { InventoryHistory } from '@/types';
import { format, subDays } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { request } from '@/lib/request';

const InventoryHistoryPage = () => {
    const { getCurrentUser, setHistories, getInventoryHistory } = useData();
    const [search, setSearch] = useState('');
    const inventoryHistory = getInventoryHistory();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    })

    useEffect(() => {
        if (getCurrentUser() && date?.from && date?.to) {
            getHistoryies();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrentUser(), date])

    const getHistoryies = async () => {

        try {

            const response = await request({
                method: "POST",
                url: '/history/getHistories',
                data: {
                    from: date?.from,
                    to: date?.to
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            });

            if (response) {
                console.log(response);
                setHistories(response);
            }

        } catch (error) {
            console.log(error);
        }

    }

    // Filter history entries based on search term
    const filteredHistory = inventoryHistory.filter(entry =>
        entry.productName.toLowerCase().includes(search.toLowerCase()) ||
        entry.userName.toLowerCase().includes(search.toLowerCase()) ||
        entry.actionType.toLowerCase().includes(search.toLowerCase())
    );

    // Sort history by createAt (most recent first)
    const sortedHistory = [...filteredHistory].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Get action badge variant and icon based on action type
    const getActionBadge = (action: InventoryHistory['actionType']) => {
        switch (action) {
            case 'new':
                return {
                    variant: 'default',
                    icon: <Plus className="h-3 w-3 mr-1" />,
                    label: 'Added'
                };
            case 'update':
                return {
                    variant: 'secondary',
                    icon: <Pencil className="h-3 w-3 mr-1" />,
                    label: 'Updated'
                };
            case 'delete':
                return {
                    variant: 'destructive',
                    icon: <Trash className="h-3 w-3 mr-1" />,
                    label: 'Deleted'
                };
            case 'stock-in':
                return {
                    variant: 'outline',
                    icon: <ArrowUp className="h-3 w-3 mr-1 text-green-500" />,
                    label: 'Stock In'
                };
            case 'stock-out':
                return {
                    variant: 'outline',
                    icon: <ArrowDown className="h-3 w-3 mr-1 text-amber-500" />,
                    label: 'Stock Out'
                };
            default:
                return {
                    variant: 'outline',
                    icon: null,
                    label: action
                };
        }
    };

    // Format the display of stock changes
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
                    <span className={`ml-2 ${isIncrease ? 'text-green-500' : 'text-amber-500'}`}>
                        {isIncrease ? '+' : ''}{change}
                    </span>
                </div>
            );
        }

        if (newStock !== undefined) {
            return <span>{newStock}</span>;
        }

        if (oldStock !== undefined) {
            return <span>{oldStock}</span>;
        }

        return <span>-</span>;
    };

    // Render table for history items (desktop) and card layout (mobile)
    const renderHistoryItems = (historyItems: InventoryHistory[]) => (
        <>
            {/* Desktop Table */}
            <div className="hidden xl:block">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Inventory Changes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap">Date & Time</TableHead>
                                        <TableHead className="whitespace-nowrap">Product</TableHead>
                                        <TableHead className="whitespace-nowrap">Action</TableHead>
                                        <TableHead className="whitespace-nowrap">Stock Change</TableHead>
                                        <TableHead className="whitespace-nowrap">Updated By</TableHead>
                                        <TableHead className="whitespace-nowrap">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {historyItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                No history records found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        historyItems.map(entry => {
                                            const actionBadge = getActionBadge(entry.actionType);
                                            return (
                                                <TableRow key={entry.id} className="hover:bg-muted/50">
                                                    <TableCell className="whitespace-nowrap text-sm">
                                                        {entry.createdAt ? format(new Date(entry.createdAt), 'MMM d, yyyy h:mm a') : 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                            <span className="truncate max-w-[150px] xl:max-w-none">{entry.productName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <Badge
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            variant={actionBadge.variant as any}
                                                            className="flex items-center justify-center w-fit"
                                                        >
                                                            {actionBadge.icon}
                                                            <span className="hidden xl:inline">{actionBadge.label}</span>
                                                            <span className="xl:hidden">{actionBadge.label.charAt(0)}</span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <div className="flex items-center text-sm">
                                                            {formatStockChange(entry)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap text-sm">
                                                        <span className="truncate max-w-[100px] xl:max-w-none block">
                                                            {entry.userName}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {entry.details.reference ? (
                                                            <span className="text-xs text-muted-foreground truncate max-w-[100px] xl:max-w-none block">
                                                                {entry.details.reference}
                                                            </span>
                                                        ) : (
                                                            entry.details.quantity && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Qty: {entry.details.quantity}
                                                                </span>
                                                            )
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Mobile Card Layout */}
            <div className="xl:hidden space-y-4">
                {historyItems.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">No history records found</CardContent>
                    </Card>
                ) : (
                    historyItems.map(entry => {
                        const actionBadge = getActionBadge(entry.actionType);
                        return (
                            <Card key={entry.id} className="p-0">
                                <CardContent className="py-4 px-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{format(new Date(entry.createdAt), 'MMM d, yyyy h:mm a')}</span>
                                        <Badge
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            variant={actionBadge.variant as any}
                                            className="flex items-center gap-1 px-2 py-1 text-xs"
                                        >
                                            {actionBadge.icon}
                                            {actionBadge.label}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <span className="font-medium text-sm truncate">{entry.productName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-muted-foreground">Stock:</span>
                                        {formatStockChange(entry)}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-muted-foreground">By:</span>
                                        <span className="truncate">{entry.userName}</span>
                                    </div>
                                    {entry.details.reference && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-muted-foreground">Details:</span>
                                            <span className="truncate">{entry.details.reference}</span>
                                        </div>
                                    )}
                                    {entry.details.quantity && !entry.details.reference && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-muted-foreground">Qty:</span>
                                            <span>{entry.details.quantity}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </>
    );

    return (
        <div className="space-y-6 w-full px-4 xl:px-6 md:px-10">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl xl:text-3xl font-bold">Inventory History</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-10 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <DateRangePicker setDate={setDate} date={date} />
            </div>

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
