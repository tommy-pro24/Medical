
export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'warehouse' | 'client';
    token: string;
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
    deliveryAgent?: string;
    deliveryDate?: Date;
    totalAmount: number;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
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


export interface InventoryHistory {
    id: string;
    productId: string;
    productName: string;
    actionType: 'add' | 'update' | 'delete' | 'stock-in' | 'stock-out';
    timestamp: Date;
    userId: string;
    userName: string;
    details: {
        oldValue?: {
            stockLevel?: number;
            price?: number;
        };
        newValue?: {
            stockLevel?: number;
            price?: number;
        };
        quantity?: number;
        reference?: string;
    };
}