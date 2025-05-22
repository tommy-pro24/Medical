import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { format } from 'date-fns';
import { InventoryHistory } from '@/types';

interface HistoryTableProps {
    historyItems: InventoryHistory[];
    getActionBadge: (action: InventoryHistory['actionType']) => { variant: string; icon: React.ReactNode; label: string };
    formatStockChange: (entry: InventoryHistory) => React.ReactNode;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ historyItems, getActionBadge, formatStockChange }) => (
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
);

export default HistoryTable; 