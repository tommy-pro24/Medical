import { Metadata } from 'next';
import React, { useEffect, useState } from 'react';
import { useData } from '@/context/DataContext';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
    ShoppingCart, Package, FileText, Truck,
    ChevronRight, Check, Sparkles, User, ChevronDown, ChevronUp
} from 'lucide-react';
import { Order } from '@/types';
import { toast } from '@/hooks/use-toast';
import { request } from '@/lib/request';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import OrdersHeader from '@/components/orders/OrdersHeader';
import { cn } from '@/lib/utils';

const ORDER_STEPS = [
    { key: 'pending', label: 'Pending', icon: <Check className="h-4 w-4" /> },
    { key: 'dispatched', label: 'Dispatched', icon: <Package className="h-4 w-4" /> },
    { key: 'in-transit', label: 'In Transit', icon: <Truck className="h-4 w-4" /> },
    { key: 'confirmed', label: 'Confirmed', icon: <FileText className="h-4 w-4" /> },
] as const;

export const metadata: Metadata = {
    title: 'Orders',
    description: 'Manage and track your orders',
};

const NewBadge = () => (
    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
        <Sparkles className="h-3 w-3" />
        New
    </div>
);

export default function OrdersPage() {
    const { getOrders, getCurrentUser, updateOrderStatus, setAllOrders } = useData();
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const { lastMessage, sendMessage } = useWebSocketContext();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });
    const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

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

    const currentUser = getCurrentUser();
    const filteredOrders = currentUser?.role === 'client'
        ? getOrders()?.filter(o => o.clientId === currentUser._id)
        : getOrders();

    // Group orders by client
    const groupedOrders = filteredOrders?.reduce((acc, order) => {
        if (!acc[order.clientId]) {
            acc[order.clientId] = {
                clientId: order.clientId,
                clientName: order.clientName,
                orders: []
            };
        }
        acc[order.clientId].orders.push(order);
        return acc;
    }, {} as Record<string, { clientId: string; clientName: string; orders: Order[] }>);

    const toggleUserExpansion = (clientId: string) => {
        setExpandedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(clientId)) {
                newSet.delete(clientId);
            } else {
                newSet.add(clientId);
            }
            return newSet;
        });
    };

    const searchedGroupedOrders = Object.values(groupedOrders || {}).filter(group =>
        group.clientName.toLowerCase().includes(search.toLowerCase()) ||
        group.orders.some(order =>
            order.id.includes(search) ||
            order.status.toLowerCase().includes(search.toLowerCase())
        )
    );

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

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleStatusChange = async (id: string, newStatus: Order['status']) => {
        updateOrderStatus(id, newStatus);
        toast({ title: 'Order Status Updated', description: `Order #${id} status changed to ${newStatus}` });
        sendMessage({
            type: "SET_DISPATCHED",
            payload: { id, newStatus, token: getCurrentUser()?.token },
            timestamp: Date.now(),
        });

        setDialogOpen(false);
        setTimeout(() => {
            const updatedOrder = getOrders().find(o => o.id === id);
            if (updatedOrder) setSelectedOrder(updatedOrder);
        }, 10);
    };

    return (
        <div className="space-y-6 w-full py-4 px-4 sm:px-6 md:px-10">
            <OrdersHeader search={search} setSearch={setSearch} date={date} setDate={setDate} />
            <div className="flex flex-col gap-4">
                {currentUser?.role !== 'client' ? (
                    // Grouped view for non-client users
                    searchedGroupedOrders.map(group => (
                        <Card key={group.clientId} className="border border-input bg-[#181f2a] rounded-xl">
                            <CardContent className="p-0">
                                <div
                                    className="p-4 cursor-pointer hover:bg-[#232b3b] transition-colors flex items-center justify-between"
                                    onClick={() => toggleUserExpansion(group.clientId)}
                                >
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-blue-400" />
                                        <div>
                                            <h3 className="font-semibold text-lg">{group.clientName}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {group.orders.length} {group.orders.length === 1 ? 'order' : 'orders'}
                                            </p>
                                        </div>
                                    </div>
                                    {expandedUsers.has(group.clientId) ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>

                                {expandedUsers.has(group.clientId) && (
                                    <div className="border-t border-border">
                                        {group.orders.map(order => {
                                            const currentIdx = ORDER_STEPS.findIndex(s => s.key === order.status);
                                            return (
                                                <div
                                                    key={order.id}
                                                    className="p-4 border-b border-border last:border-0 hover:bg-[#232b3b] transition-colors cursor-pointer"
                                                    onClick={() => handleOrderClick(order)}
                                                >
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-6 items-center">
                                                        {/* Left: Order Info */}
                                                        <div className="flex flex-col items-start sm:items-start text-left">
                                                            <span className="font-semibold text-lg">Order #{order.id}</span>
                                                            <span className={`text-sm ${getStatusColor(order.status)} font-medium`}>• {order.status}</span>
                                                            <span className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleDateString('en-GB')}</span>
                                                        </div>
                                                        {/* Center: Progress Bar */}
                                                        <div className="min-w-0 flex justify-center w-full">
                                                            <div className="flex items-center w-full min-w-[320px] max-w-xl justify-between gap-2 sm:gap-4 overflow-x-auto">
                                                                {ORDER_STEPS.map((step, idx) => {
                                                                    const isActive = idx <= currentIdx;
                                                                    const isCurrent = idx === currentIdx;
                                                                    return (
                                                                        <React.Fragment key={step.key}>
                                                                            <div className="flex flex-col items-center min-w-[48px]">
                                                                                <div className={cn(
                                                                                    "flex items-center justify-center rounded-full h-8 w-8 border-2 transition-all duration-200",
                                                                                    isCurrent ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' :
                                                                                        isActive ? 'bg-blue-900 border-blue-600 text-blue-200' :
                                                                                            'bg-[#232b3b] border-[#232b3b] text-muted-foreground'
                                                                                )}>
                                                                                    {step.icon}
                                                                                </div>
                                                                                <span className={cn(
                                                                                    "mt-1 text-xs font-medium",
                                                                                    isCurrent ? 'text-blue-400' :
                                                                                        isActive ? 'text-blue-200' :
                                                                                            'text-muted-foreground'
                                                                                )}>{step.label}</span>
                                                                            </div>
                                                                            {idx < ORDER_STEPS.length - 1 && (
                                                                                <div className={cn(
                                                                                    "flex-1 h-1 transition-all duration-200",
                                                                                    idx < currentIdx ? 'bg-blue-600' : 'bg-[#232b3b]'
                                                                                )} />
                                                                            )}
                                                                        </React.Fragment>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                        {/* Right: Amount/Arrow */}
                                                        <div className="flex flex-col items-end sm:items-end text-right">
                                                            <div className="mt-1">
                                                                <div className="text-xs text-muted-foreground">Amount</div>
                                                                <div className="font-medium">₹{order?.totalAmount?.toLocaleString()}</div>
                                                            </div>
                                                            <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 hidden sm:block" />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    // Original view for client users
                    filteredOrders?.map(order => {
                        const currentIdx = ORDER_STEPS.findIndex(s => s.key === order.status);
                        return (
                            <Card
                                key={order.id}
                                className="cursor-pointer border border-input hover:shadow-md transition-shadow bg-[#181f2a] rounded-xl px-0 sm:px-2 py-2 relative"
                                onClick={() => handleOrderClick(order)}
                            >
                                {(getCurrentUser()?.role === 'admin' && order.status === 'pending') ||
                                    (getCurrentUser()?.role === 'warehouse' && order.status === 'dispatched') ? (
                                    <NewBadge />
                                ) : null}
                                <CardContent className="p-0 sm:p-5">
                                    {/* Responsive Grid Layout: Left (order info), Center (progress), Right (client/amount) */}
                                    <div className="w-full px-4 pb-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-x-6 items-center">
                                            {/* Left: Order Info */}
                                            <div className="flex flex-col items-start sm:items-start text-left">
                                                <span className="font-semibold text-lg">Order #{order.id}</span>
                                                <span className={`text-sm ${getStatusColor(order.status)} font-medium`}>• {order.status}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(order.orderDate).toLocaleDateString('en-GB')}</span>
                                            </div>
                                            {/* Center: Progress Bar */}
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
                                            {/* Right: Client/Amount/Arrow */}
                                            <div className="flex flex-col items-end sm:items-end text-right">
                                                <div>
                                                    <div className="text-xs text-muted-foreground">Client</div>
                                                    <div className="font-medium break-words max-w-[120px] sm:max-w-none">{order.clientName}</div>
                                                </div>
                                                <div className="mt-1">
                                                    <div className="text-xs text-muted-foreground">Amount</div>
                                                    <div className="font-medium">₹{order?.totalAmount?.toLocaleString()}</div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 hidden sm:block" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}

                {searchedGroupedOrders.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No orders found. {currentUser?.role === 'client' && "Create a new order to get started."}
                    </div>
                )}
            </div>

            {selectedOrder && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                                            <span className={`font-medium ${getStatusColor(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>

                                        {/* <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Invoice Status</span>
                                            <span className="font-medium">
                                                {selectedOrder.invoiceStatus.replace('-', ' ')}
                                            </span>
                                        </div> */}

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

                                        {/* {selectedOrder.estimatedDeliveryTime && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Est. Delivery</span>
                                                <span className="font-medium">
                                                    {new Date(selectedOrder.estimatedDeliveryTime).toLocaleDateString('en-GB')}
                                                </span>
                                            </div>
                                        )} */}

                                        <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                                            <span className="text-muted-foreground">Total Amount</span>
                                            <span className="font-medium text-lg">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {currentUser?.role !== 'client' && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium mb-2">Update Order Status</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {getCurrentUser()?.role !== 'admin' &&
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center justify-center gap-2"
                                                    disabled={selectedOrder.status !== 'dispatched'}
                                                    onClick={() => handleStatusChange(selectedOrder.id, 'in-transit')}
                                                >
                                                    <Truck className="h-4 w-4" />
                                                    In Transit
                                                </Button>
                                            }
                                            {getCurrentUser()?.role === 'admin' &&
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center justify-center gap-2"
                                                    disabled={selectedOrder.status !== 'pending'}
                                                    onClick={() => handleStatusChange(selectedOrder.id, 'dispatched')}
                                                >
                                                    <Package className="h-4 w-4" />
                                                    Dispatched
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                )}

                                {currentUser?.role === 'client' && selectedOrder.status === 'in-transit' && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium mb-2">Update Order Status</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="outline"
                                                className="flex items-center justify-center gap-2"
                                                onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                                            >
                                                <Check className="h-4 w-4" />
                                                Confirm Order
                                            </Button>

                                            <Button
                                                variant="outline"
                                                className="flex items-center justify-center gap-2"
                                                onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                                            >
                                                <FileText className="h-4 w-4" />
                                                Cancel Order
                                            </Button>
                                        </div>
                                    </div>
                                )}
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
                                                            {item.quantity} x ₹{item.unitPrice.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="font-medium">
                                                        ₹{(item.quantity * item.unitPrice).toString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                                            <span className="font-medium">Total</span>
                                            <span className="font-medium text-lg">
                                                ₹{selectedOrder.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="mt-4 flex gap-3">
                                    <Button
                                        className="flex items-center justify-center gap-2 flex-1"
                                        variant="secondary"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Download Invoice
                                    </Button>

                                    {/* <Button
                                        className="flex items-center justify-center gap-2 flex-1"
                                    >
                                        <Truck className="h-4 w-4" />
                                        Track Order
                                    </Button> */}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Create New Order Dialog */}
            <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create New Order</DialogTitle>
                    </DialogHeader>
                    <NewOrderForm onClose={() => setOrderDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

const NewOrderForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { getProducts, getCurrentUser } = useData();
    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});

    const currentUser = getCurrentUser();
    const products = getProducts();

    const handleQuantityChange = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            const newProducts = { ...selectedProducts };
            delete newProducts[productId];
            setSelectedProducts(newProducts);
        } else {
            setSelectedProducts({
                ...selectedProducts,
                [productId]: quantity
            });
        }
    };

    const handleSubmit = () => {
        if (!currentUser) return;

        const orderItems = Object.entries(selectedProducts).map(([productId, quantity]) => {
            const product = products.find(p => p._id === productId);
            if (!product) throw new Error(`Product not found: ${productId}`);

            return {
                productId,
                productName: product.name,
                quantity,
                unitPrice: product.price,
            };
        });

        if (orderItems.length === 0) {
            toast({
                title: 'Order Error',
                description: 'Please add at least one product to your order',
                variant: 'destructive'
            });
            return;
        }
        onClose();
    };

    const totalAmount = Object.entries(selectedProducts).reduce((sum, [productId, quantity]) => {
        const product = products.find(p => p._id === productId);
        return sum + (product?.price || 0) * quantity;
    }, 0);

    return (
        <div className="space-y-4">
            <div className="max-h-[400px] overflow-y-auto pr-2">
                {products.map((product) => {
                    const isSelected = !!selectedProducts[product._id];

                    return (
                        <div
                            key={product._id}
                            className="flex items-center justify-between border-b border-border py-3"
                        >
                            <div className="flex items-start gap-4">
                                <Checkbox
                                    id={`product-${product._id}`}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            handleQuantityChange(product._id, 1);
                                        } else {
                                            handleQuantityChange(product._id, 0);
                                        }
                                    }}
                                />
                                <div>
                                    <label
                                        htmlFor={`product-${product._id}`}
                                        className="font-medium cursor-pointer"
                                    >
                                        {product.name}
                                    </label>
                                    <div className="text-sm text-muted-foreground">{product.description}</div>
                                    <div className="text-sm">₹{product.price.toLocaleString()}</div>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="flex items-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuantityChange(
                                            product._id,
                                            Math.max(1, (selectedProducts[product._id] || 0) - 1)
                                        )}
                                    >
                                        -
                                    </Button>
                                    <span className="px-3 min-w-[40px] text-center">
                                        {selectedProducts[product._id]}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuantityChange(
                                            product._id,
                                            (selectedProducts[product._id] || 0) + 1
                                        )}
                                    >
                                        +
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Total Amount</span>
                    <span className="font-medium text-lg">₹{totalAmount.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={Object.keys(selectedProducts).length === 0}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Place Order
                </Button>
            </div>
        </div>
    );
};
