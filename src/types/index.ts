
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'warehouse' | 'client' | 'logistics';
}

export interface Product {
    _id: string;
    name: string;
    category: 'diagnostic' | 'surgical' | 'consumable' | 'other';
    description: string;
    price: number;
    stockNumber: number;
    lowStockThreshold: number;
    image?: string;
}

export interface Order {
    id: string;
    clientId: string;
    clientName: string;
    orderDate: Date;
    status: 'pending' | 'confirmed' | 'dispatched' | 'in-transit' | 'cancelled';
    items: OrderItem[];
    invoiceStatus: 'draft' | 'proforma-sent' | 'invoice-confirmed' | 'paid';
    deliveryAgent?: string;
    deliveryDate?: Date;
    estimatedDeliveryTime?: Date;
    totalAmount: number;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface StockTransaction {
    id: string;
    productId: string;
    type: 'in' | 'out';
    quantity: number;
    date: Date;
    reference?: string;
    note?: string;
}

export interface DeliveryUpdate {
    id: string;
    orderId: string;
    status: 'pending' | 'dispatched' | 'in-transit' | 'confirmed';
    timestamp: Date;
    note?: string;
    location?: string;
    updatedBy: string;
}
