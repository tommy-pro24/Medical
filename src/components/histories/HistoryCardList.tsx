import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { format } from 'date-fns';
import { InventoryHistory } from '@/types';

interface HistoryCardListProps {
    historyItems: InventoryHistory[];
    getActionBadge: (action: InventoryHistory['actionType']) => { variant: string; icon: React.ReactNode; label: string };
    formatStockChange: (entry: InventoryHistory) => React.ReactNode;
}

const HistoryCardList: React.FC<HistoryCardListProps> = ({ historyItems, getActionBadge, formatStockChange }) => (
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
                            <div key="header" className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{format(new Date(entry.createdAt), 'MMM d, yyyy h:mm a')}</span>
                                <Badge
                                    key="badge"
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    variant={actionBadge.variant as any}
                                    className="flex items-center gap-1 px-2 py-1 text-xs"
                                >
                                    {actionBadge.icon}
                                    {actionBadge.label}
                                </Badge>
                            </div>
                            <div key="product" className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium text-sm truncate">{entry.productName}</span>
                            </div>
                            <div key="stock" className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Stock:</span>
                                {formatStockChange(entry)}
                            </div>
                            <div key="user" className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">By:</span>
                                <span className="truncate">{entry.userName}</span>
                            </div>
                            {entry.details.reference && (
                                <div key="reference" className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground">Details:</span>
                                    <span className="truncate">{entry.details.reference}</span>
                                </div>
                            )}
                            {entry.details.quantity && !entry.details.reference && (
                                <div key="quantity" className="flex items-center gap-2 text-xs">
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
);

export default HistoryCardList; 