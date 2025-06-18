import { Metadata } from 'next';
import React, { useEffect, useState } from 'react';
import { useData } from '@/context/DataContext';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText, Truck,
    ChevronRight, Check
} from 'lucide-react';
import { Order } from '@/types';
import { toast } from '@/hooks/use-toast';
import { request } from '@/lib/request';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import OrdersHeader from '@/components/orders/OrdersHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable?: { finalY: number };
    }
}

const ORDER_STEPS = [
    { key: 'pending', label: 'Pending', icon: <Check className="h-4 w-4" /> },
    { key: 'dispatched', label: 'Dispatched', icon: <FileText className="h-4 w-4" /> },
    { key: 'in-transit', label: 'In Transit', icon: <Truck className="h-4 w-4" /> },
    { key: 'confirmed', label: 'Confirmed', icon: <FileText className="h-4 w-4" /> },
] as const;

export const metadata: Metadata = {
    title: 'Orders',
    description: 'Manage and track your orders',
};

// Helper to load image as base64
async function getBase64FromUrl(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// PDF generation function for invoice
async function generateInvoicePDF(order: Order, logoBase64: string) {
    const doc = new jsPDF();

    // --- Outer border ---
    doc.setDrawColor(150, 0, 0);
    doc.setLineWidth(0.7);
    doc.rect(5, 5, 200, 287);

    // --- Header: PURCHASE ORDER ---
    doc.setFontSize(28);
    doc.setTextColor(80, 60, 120);
    doc.text('PURCHASE ORDER', 20, 22);

    // --- Add logo image (top right) ---
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 170, 10, 25, 20, undefined, 'FAST');
    }

    // --- Slogan ---
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120);
    doc.text('[Your Company Slogan]', 20, 32);

    // --- Date and PO # ---
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Date: ${order?.orderDate ? new Date(order.orderDate).toLocaleDateString() : ' '}`, 150, 32);

    // --- Vendor/Ship To box ---
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 36, 180, 38, 'FD');

    // --- Vendor/Ship To titles ---
    doc.setFontSize(13);
    doc.setTextColor(60, 120, 200);
    doc.text('Vendor', 25, 44);
    doc.text('Ship To', 125, 44);

    // --- Vendor/Ship To details (responsive, no overlap) ---
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const vendorLines = [
        `Name: ${order?.clientName}`,
        'Phone : 362373453',
    ];
    const shipToLines = [
        'Company Name: Medical',
        'Street Address: ssdfsdf',
        'Phone: 1234567898',
    ];
    // Use maxWidth to wrap text and avoid overlap
    doc.text(vendorLines, 20, 50, { maxWidth: 80 });
    doc.text(shipToLines, 120, 50, { maxWidth: 70 });

    // --- Shipping info lines ---
    doc.setDrawColor(150, 0, 0);
    doc.line(15, 82, 90, 82); // Shipping Method
    doc.line(90, 82, 150, 82); // Shipping Terms
    doc.line(150, 82, 195, 82); // Delivery Date

    // --- Table ---
    const tableColumn = [
        { header: 'Qty', dataKey: 'qty' },
        { header: 'Item', dataKey: 'item' },
        { header: 'Description', dataKey: 'desc' },
        { header: 'Unit Price', dataKey: 'unit' },
        { header: 'Line Total', dataKey: 'total' }
    ];
    const tableRows = order.items.map((item) => ({
        qty: item.quantity || ' ',
        item: item.productId || ' ',
        desc: item.productName || ' ',
        unit: item.unitPrice ? `$${item.unitPrice.toLocaleString()}` : ' ',
        total: item.quantity && item.unitPrice ? `$${(item.quantity * item.unitPrice).toLocaleString()}` : ' '
    }));
    while (tableRows.length < 10) {
        tableRows.push({ qty: ' ', item: ' ', desc: ' ', unit: ' ', total: ' ' });
    }
    autoTable(doc, {
        columns: tableColumn,
        body: tableRows,
        startY: 85,
        theme: 'grid',
        styles: {
            lineColor: [150, 0, 0],
            lineWidth: 0.5,
            halign: 'center',
            valign: 'middle',
            fontSize: 10,
            textColor: [0, 0, 0]
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [150, 0, 0],
            fontStyle: 'bold',
            lineWidth: 0.7
        },
        tableLineColor: [150, 0, 0],
        tableLineWidth: 0.7,
        columnStyles: {
            qty: { cellWidth: 15 },
            item: { cellWidth: 40 },
            desc: { cellWidth: 60 },
            unit: { cellWidth: 30 },
            total: { cellWidth: 30 }
        },
        tableWidth: 'wrap',
        margin: { left: 15, right: 15 },
        showHead: 'firstPage',
        showFoot: 'never'
    });

    // --- Totals ---
    const finalY = doc.lastAutoTable?.finalY || 140;
    doc.setFontSize(11);
    doc.setTextColor(150, 0, 0);
    doc.text('Total', 150, finalY + 22);
    doc.setTextColor(0, 0, 0);
    doc.text(`$${order?.totalAmount?.toLocaleString() || ' '}`, 190, finalY + 22, { align: 'right' });

    // --- Footer ---
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Template provided by http://www.word-templates.com', 15, 285);

    doc.save(`Invoice_Order_${order.id}.pdf`);
}

export default function OrdersPage() {
    const { getOrders, getCurrentUser, setAllOrders, updateOrderStatus } = useData();
    const [search, setSearch] = useState('');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });
    const { lastMessage, sendMessage } = useWebSocketContext();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.type === 'GET_ORDERS_ERROR') {
                toast({ title: "Get orders error", description: "" });
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        if (getCurrentUser() && date?.from && date?.to) {
            onLoad();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrentUser(), date]);

    const onLoad = async () => {
        const response = await request({
            method: "POST",
            url: '/order/getAllOrders',
            data: { from: date?.from, to: date?.to },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCurrentUser()?.token}`
            }
        });
        setAllOrders(response);
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'text-yellow-500';
            case 'confirmed': return 'text-blue-500';
            case 'dispatched': return 'text-orange-500';
            case 'in-transit': return 'text-purple-500';
            case 'cancelled': return 'text-red-500';
            default: return '';
        }
    };

    const handleStatusChange = async (id: string, newStatus: Order['status']) => {
        try {
            // First make the API request
            // Then update local state and send WebSocket message
            updateOrderStatus(id, newStatus);
            toast({ title: 'Order Status Updated', description: `Order #${id} status changed to ${newStatus}` });
            sendMessage({
                type: "SET_DISPATCHED",
                payload: { id, newStatus, token: getCurrentUser()?.token },
                timestamp: Date.now(),
            });

            setSelectedOrder(null);
            setTimeout(() => {
                const updatedOrder = getOrders().find(o => o.id === id);
                if (updatedOrder) setSelectedOrder(updatedOrder);
            }, 10);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update order status. Please try again.",
                variant: "destructive"
            });
        }
    };

    // Role-specific buttons that should be available to all users
    const renderRoleSpecificButtons = (order: Order) => (
        <div className="mt-4 flex gap-3">
            {getCurrentUser()?.role === "admin" && order.status === "pending" && (
                <Button
                    onClick={() => handleStatusChange(order.id, 'dispatched')}
                >
                    Dispatched
                </Button>
            )}
            {getCurrentUser()?.role === 'warehouse' && order.status === 'dispatched' && (
                <Button
                    onClick={() => handleStatusChange(order.id, 'in-transit')}
                >
                    In Transit
                </Button>
            )}
            {getCurrentUser()?.role === 'client' && order.status === 'in-transit' && (
                <>
                    <Button
                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                    >
                        Confirmed
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                    >
                        Cancel Order
                    </Button>
                </>
            )}
        </div>
    );

    const currentUser = getCurrentUser();
    const allOrders = getOrders() || [];

    if (currentUser?.role === 'client') {
        const filteredOrders = allOrders.filter(o => o.clientId === currentUser._id);
        const searchedOrders = filteredOrders.filter(order =>
            order?.id?.includes(search) ||
            order?.clientName.toLowerCase().includes(search.toLowerCase()) || order?.status.includes(search.toLowerCase())
        );
        return (
            <div className="space-y-6 w-full py-4 px-4 sm:px-6 md:px-10">
                <OrdersHeader search={search} setSearch={setSearch} date={date} setDate={setDate} />
                <div className="flex flex-col gap-4">
                    {searchedOrders?.map(order => {
                        const currentIdx = ORDER_STEPS.findIndex(s => s.key === order.status);
                        return (
                            <Card
                                key={order.id}
                                className="cursor-pointer border border-input hover:shadow-md transition-shadow bg-[#181f2a] rounded-xl px-0 sm:px-2 py-2 relative"
                                onClick={() => setSelectedOrder(order)}
                            >
                                <CardContent className="p-0 sm:p-5">
                                    <div className="w-full px-4 pb-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-6 items-center">
                                            <div className="flex flex-col items-start text-left">
                                                <span className="font-semibold text-lg">Order #{order.id}</span>
                                                <span className={`text-sm ${getStatusColor(order.status)} font-medium`}>• {order.status}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleDateString('en-GB')}</span>
                                            </div>
                                            <div className="min-w-0 flex justify-center w-full">
                                                <div className="flex items-center w-full min-w-[320px] max-w-xl justify-between gap-2 sm:gap-4 overflow-x-auto">
                                                    {ORDER_STEPS.map((step, idx) => {
                                                        const isActive = idx <= currentIdx;
                                                        const isCurrent = idx === currentIdx;
                                                        return (
                                                            <React.Fragment key={step.key}>
                                                                <div className="flex flex-col items-center min-w-[48px]">
                                                                    <div className={`flex items-center justify-center rounded-full h-8 w-8 border-2 transition-all duration-200 ${isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' : isActive ? 'bg-blue-900 border-blue-600 text-blue-200' : 'bg-[#232b3b] border-[#232b3b] text-muted-foreground'} `}>
                                                                        {step.icon}
                                                                    </div>
                                                                    <span className={`mt-1 text-xs font-medium ${isCurrent ? 'text-blue-400' : isActive ? 'text-blue-200' : 'text-muted-foreground'}`}>{step.label}</span>
                                                                </div>
                                                                {idx < ORDER_STEPS.length - 1 && (
                                                                    <div className={`flex-1 h-1 ${idx < currentIdx ? 'bg-blue-600' : 'bg-[#232b3b]'} transition-all duration-200`} />
                                                                )}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end text-right">
                                                <div>
                                                    <div className="text-xs text-muted-foreground">Client</div>
                                                    <div className="font-medium break-words max-w-[120px] sm:max-w-none">{order.clientName}</div>
                                                </div>
                                                <div className="mt-1">
                                                    <div className="text-xs text-muted-foreground">Amount</div>
                                                    <div className="font-medium">${order?.totalAmount?.toLocaleString()}</div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 hidden sm:block" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                    {searchedOrders?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No orders found. Create a new order to get started.
                        </div>
                    )}
                </div>
                {selectedOrder && (
                    <Dialog open={!!selectedOrder} onOpenChange={open => { if (!open) setSelectedOrder(null); }}>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Order Details</CardTitle>
                                            <CardDescription>
                                                {new Date(selectedOrder.orderDate).toLocaleDateString('en-GB')}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Status</span>
                                                <span className={`font-medium ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Client</span>
                                                <span className="font-medium">{selectedOrder.clientName}</span>
                                            </div>
                                            {selectedOrder.deliveryAgent && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">Delivery Agent</span>
                                                    <span className="font-medium">{selectedOrder.deliveryAgent}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                                                <span className="text-muted-foreground">Total Amount</span>
                                                <span className="font-medium text-lg">${selectedOrder.totalAmount.toLocaleString()}</span>
                                            </div>
                                            {renderRoleSpecificButtons(selectedOrder)}
                                        </CardContent>
                                    </Card>
                                </div>
                                <div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Order Items</CardTitle>
                                            <CardDescription>
                                                {selectedOrder.items.length} items in this order
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="sm:max-h-[300px] max-h-none sm:overflow-y-auto overflow-visible sm:pr-2 sm:scrollbar-thin sm:scrollbar-thumb-blue-700 sm:scrollbar-track-blue-200 sm:rounded-md scrollbar-none">
                                                {selectedOrder.items.map((item, index) => (
                                                    <div
                                                        key={`${item.productId}-${index}`}
                                                        className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                                                    >
                                                        <div>
                                                            <div className="font-medium">{item.productName}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {item.quantity} x ${item.unitPrice.toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="font-medium">
                                                            ${(item.quantity * item.unitPrice).toString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                                                <span className="font-medium">Total</span>
                                                <span className="font-medium text-lg">
                                                    ${selectedOrder.totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <div className="mt-4 flex gap-3">
                                        <Button
                                            className="flex items-center justify-center gap-2 flex-1"
                                            variant="secondary"
                                            onClick={async () => {
                                                const logoBase64 = await getBase64FromUrl('/imgs/icons/logo.png');
                                                await generateInvoicePDF(selectedOrder, logoBase64);
                                            }}
                                        >
                                            <FileText className="h-4 w-4" />
                                            Download Invoice
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        );
    }

    // For admin/warehouse: group by client info from orders
    // Group orders by clientId and clientName
    const clientOrdersMap: Record<string, { clientName: string, orders: Order[] }> = {};
    allOrders.forEach(order => {
        if (!clientOrdersMap[order.clientId]) {
            clientOrdersMap[order.clientId] = { clientName: order.clientName, orders: [] };
        }
        clientOrdersMap[order.clientId].orders.push(order);
    });
    // Get array of clients with orders
    const clientsWithOrders = Object.entries(clientOrdersMap).map(([clientId, { clientName, orders }]) => ({
        clientId,
        clientName,
        orders
    }));
    // Search by clientName
    const searchedClients = clientsWithOrders.filter(client =>
        client.clientName.toLowerCase().includes(search.toLowerCase())
    );
    // If a client is selected, show their orders
    let clientOrders: Order[] = [];
    let selectedClient: { clientId: string, clientName: string } | null = null;
    if (selectedClientId) {
        const found = clientsWithOrders.find(c => c.clientId === selectedClientId);
        clientOrders = found ? found.orders : [];
        selectedClient = found ? { clientId: found.clientId, clientName: found.clientName } : null;
    }

    return (
        <div className="space-y-6 w-full py-4 px-4 sm:px-6 md:px-10">
            <OrdersHeader search={search} setSearch={setSearch} date={date} setDate={setDate} />
            <div className="flex flex-col gap-4">
                {/* Drill-down UI for non-client users */}
                {!selectedClientId ? (
                    // Show list of clients
                    searchedClients.length > 0 ? (
                        searchedClients.map(client => (
                            <Card
                                key={client.clientId}
                                className="cursor-pointer border border-input hover:shadow-md transition-shadow bg-[#181f2a] rounded-xl px-0 sm:px-2 py-2 relative"
                                onClick={() => setSelectedClientId(client.clientId)}
                            >
                                <CardContent className="p-0 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full px-4 pb-4">
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-semibold text-lg">{client.clientName}</span>
                                            <span className="text-xs text-muted-foreground">Client ID: {client.clientId}</span>
                                        </div>
                                        <div className="flex flex-col items-end text-right mt-2 sm:mt-0">
                                            <span className="text-xs text-muted-foreground">Orders</span>
                                            <span className="font-medium text-lg">{client.orders.length}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            No clients with orders found.
                        </div>
                    )
                ) : (
                    // Show orders for selected client
                    <>
                        <div className="mb-2">
                            <Button variant="outline" onClick={() => setSelectedClientId(null)}>
                                ← Back to Orders
                            </Button>
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold text-lg">{selectedClient?.clientName}</span>
                            <span className="ml-2 text-xs text-muted-foreground">Client ID: {selectedClient?.clientId}</span>
                        </div>
                        {clientOrders.length > 0 ? (
                            clientOrders.map(order => {
                                const currentIdx = ORDER_STEPS.findIndex(s => s.key === order.status);
                                return (
                                    <Card
                                        key={order.id}
                                        className="cursor-pointer border border-input hover:shadow-md transition-shadow bg-[#181f2a] rounded-xl px-0 sm:px-2 py-2 relative"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <CardContent className="p-0 sm:p-5">
                                            <div className="w-full px-4 pb-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-6 items-center">
                                                    <div className="flex flex-col items-start text-left">
                                                        <span className="font-semibold text-lg">Order #{order.id}</span>
                                                        <span className={`text-sm ${getStatusColor(order.status)} font-medium`}>• {order.status}</span>
                                                        <span className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleDateString('en-GB')}</span>
                                                    </div>
                                                    <div className="min-w-0 flex justify-center w-full">
                                                        <div className="flex items-center w-full min-w-[320px] max-w-xl justify-between gap-2 sm:gap-4 overflow-x-auto">
                                                            {ORDER_STEPS.map((step, idx) => {
                                                                const isActive = idx <= currentIdx;
                                                                const isCurrent = idx === currentIdx;
                                                                return (
                                                                    <React.Fragment key={step.key}>
                                                                        <div className="flex flex-col items-center min-w-[48px]">
                                                                            <div className={`flex items-center justify-center rounded-full h-8 w-8 border-2 transition-all duration-200 ${isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' : isActive ? 'bg-blue-900 border-blue-600 text-blue-200' : 'bg-[#232b3b] border-[#232b3b] text-muted-foreground'} `}>
                                                                                {step.icon}
                                                                            </div>
                                                                            <span className={`mt-1 text-xs font-medium ${isCurrent ? 'text-blue-400' : isActive ? 'text-blue-200' : 'text-muted-foreground'}`}>{step.label}</span>
                                                                        </div>
                                                                        {idx < ORDER_STEPS.length - 1 && (
                                                                            <div className={`flex-1 h-1 ${idx < currentIdx ? 'bg-blue-600' : 'bg-[#232b3b]'} transition-all duration-200`} />
                                                                        )}
                                                                    </React.Fragment>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end text-right">
                                                        <div>
                                                            <div className="text-xs text-muted-foreground">Amount</div>
                                                            <div className="font-medium">${order?.totalAmount?.toLocaleString()}</div>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 hidden sm:block" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                No orders found for this client.
                            </div>
                        )}
                    </>
                )}
            </div>
            {selectedOrder && (
                <Dialog open={!!selectedOrder} onOpenChange={open => { if (!open) setSelectedOrder(null); }}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Details</CardTitle>
                                        <CardDescription>
                                            {new Date(selectedOrder.orderDate).toLocaleDateString('en-GB')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className={`font-medium ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Client</span>
                                            <span className="font-medium">{selectedOrder.clientName}</span>
                                        </div>
                                        {selectedOrder.deliveryAgent && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Delivery Agent</span>
                                                <span className="font-medium">{selectedOrder.deliveryAgent}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                                            <span className="text-muted-foreground">Total Amount</span>
                                            <span className="font-medium text-lg">${selectedOrder.totalAmount.toLocaleString()}</span>
                                        </div>
                                        {renderRoleSpecificButtons(selectedOrder)}
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Items</CardTitle>
                                        <CardDescription>
                                            {selectedOrder.items.length} items in this order
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="sm:max-h-[300px] max-h-none sm:overflow-y-auto overflow-visible sm:pr-2 sm:scrollbar-thin sm:scrollbar-thumb-blue-700 sm:scrollbar-track-blue-200 sm:rounded-md scrollbar-none">
                                            {selectedOrder.items.map((item, index) => (
                                                <div
                                                    key={`${item.productId}-${index}`}
                                                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                                                >
                                                    <div>
                                                        <div className="font-medium">{item.productName}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {item.quantity} x ${item.unitPrice.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="font-medium">
                                                        ${(item.quantity * item.unitPrice).toString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                                            <span className="font-medium">Total</span>
                                            <span className="font-medium text-lg">
                                                ${selectedOrder.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="mt-4 flex gap-3">
                                    <Button
                                        className="flex items-center justify-center gap-2 flex-1"
                                        variant="secondary"
                                        onClick={async () => {
                                            const logoBase64 = await getBase64FromUrl('/imgs/icons/logo.png');
                                            await generateInvoicePDF(selectedOrder, logoBase64);
                                        }}
                                    >
                                        <FileText className="h-4 w-4" />
                                        Download Invoice
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
