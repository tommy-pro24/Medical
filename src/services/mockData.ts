import { Product, Order, User, DeliveryUpdate, InventoryHistory } from '../types';

// Mock Users
export const users: User[] = [
    {
        _id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1234567890',
        role: 'admin',
        password: 'admin123',
        token: 'mock-token-123',
        avatar: 'admin-avatar.jpg'
    },
    {
        _id: '2',
        name: 'Warehouse Manager',
        email: 'warehouse@example.com',
        phone: '+1234567891',
        role: 'warehouse',
        password: 'warehouse123',
        token: 'mock-token-456',
        avatar: 'warehouse-avatar.jpg'
    },
    {
        _id: '3',
        name: 'Client User',
        email: 'client@example.com',
        phone: '+1234567892',
        role: 'client',
        password: 'client123',
        token: 'mock-token-789',
        avatar: 'client-avatar.jpg'
    }
];

// Mock Products
export const products: Product[] = [];

// Mock Orders
export const orders: Order[] = [
    // {
    //     id: '1',
    //     clientId: '3',
    //     clientName: 'ABC Hospital',
    //     orderDate: new Date('2023-11-15'),
    //     status: 'confirmed',
    //     items: [
    //         {
    //             productId: '1',
    //             productName: 'Blood Glucose Monitor',
    //             quantity: 5,
    //             unitPrice: 2500,
    //             totalPrice: 12500,
    //         },
    //         {
    //             productId: '4',
    //             productName: 'Disposable Syringes (Pack of 50)',
    //             quantity: 10,
    //             unitPrice: 680,
    //             totalPrice: 6800,
    //         }
    //     ],
    //     deliveryAgent: 'John Smith',
    //     deliveryDate: new Date('2023-11-18'),
    //     totalAmount: 19300,
    // },
    // {
    //     id: '2',
    //     clientId: '3',
    //     clientName: 'ABC Hospital',
    //     orderDate: new Date('2023-11-28'),
    //     status: 'in-transit',
    //     items: [
    //         {
    //             productId: '2',
    //             productName: 'Surgical Gloves (Box of 100)',
    //             quantity: 15,
    //             unitPrice: 1200,
    //             totalPrice: 18000,
    //         }
    //     ],
    //     deliveryAgent: 'Maria Johnson',
    //     totalAmount: 18000,
    // },
    // {
    //     id: '3',
    //     clientId: '3',
    //     clientName: 'ABC Hospital',
    //     orderDate: new Date('2023-11-30'),
    //     status: 'confirmed',
    //     items: [
    //         {
    //             productId: '3',
    //             productName: 'Digital Thermometer',
    //             quantity: 8,
    //             unitPrice: 850,
    //             totalPrice: 6800,
    //         },
    //         {
    //             productId: '5',
    //             productName: 'Stethoscope',
    //             quantity: 3,
    //             unitPrice: 3200,
    //             totalPrice: 9600,
    //         }
    //     ],
    //     totalAmount: 16400,
    // },
];

// Mock Delivery Updates
export const deliveryUpdates: DeliveryUpdate[] = [
    {
        id: '1',
        orderId: '1',
        status: 'pending',
        timestamp: new Date('2023-11-15T14:30:00'),
        note: 'Order confirmed, preparing for dispatch',
        updatedBy: 'System',
    },
    {
        id: '2',
        orderId: '1',
        status: 'dispatched',
        timestamp: new Date('2023-11-16T10:15:00'),
        note: 'Order dispatched from warehouse',
        updatedBy: 'Warehouse Manager',
    },
    {
        id: '3',
        orderId: '1',
        status: 'in-transit',
        timestamp: new Date('2023-11-16T14:45:00'),
        note: 'Order in transit',
        location: 'City Distribution Center',
        updatedBy: 'John Smith',
    },
    {
        id: '4',
        orderId: '1',
        status: 'confirmed',
        timestamp: new Date('2023-11-18T11:20:00'),
        note: 'Order confirmed successfully',
        location: 'ABC Hospital',
        updatedBy: 'John Smith',
    },
    {
        id: '5',
        orderId: '2',
        status: 'pending',
        timestamp: new Date('2023-11-28T09:30:00'),
        note: 'Order confirmed, preparing for dispatch',
        updatedBy: 'System',
    },
    {
        id: '6',
        orderId: '2',
        status: 'dispatched',
        timestamp: new Date('2023-11-29T13:45:00'),
        note: 'Order dispatched from warehouse',
        updatedBy: 'Warehouse Manager',
    },
    {
        id: '7',
        orderId: '2',
        status: 'in-transit',
        timestamp: new Date('2023-11-30T10:20:00'),
        note: 'Order in transit',
        location: 'Regional Distribution Hub',
        updatedBy: 'Maria Johnson',
    },
    {
        id: '8',
        orderId: '3',
        status: 'pending',
        timestamp: new Date('2023-11-30T16:15:00'),
        note: 'Order confirmed, preparing for dispatch',
        updatedBy: 'System',
    },
];

export const inventoryHistory: InventoryHistory[] = [
    // {
    //     id: '1',
    //     productId: '1',
    //     productName: 'Blood Glucose Monitor',
    //     actionType: 'new',
    //     timestamp: new Date('2023-11-01T09:15:00'),
    //     userId: '1',
    //     userName: 'Admin User',
    //     details: {
    //         newValue: {
    //             stockLevel: 50,
    //             price: 2500
    //         }
    //     }
    // },
    // {
    //     id: '2',
    //     productId: '1',
    //     productName: 'Blood Glucose Monitor',
    //     actionType: 'update',
    //     timestamp: new Date('2023-11-10T14:30:00'),
    //     userId: '2',
    //     userName: 'Warehouse Manager',
    //     details: {
    //         oldValue: {
    //             stockLevel: 50,
    //             price: 2500
    //         },
    //         newValue: {
    //             stockLevel: 45,
    //             price: 2500
    //         }
    //     }
    // },
    // {
    //     id: '3',
    //     productId: '2',
    //     productName: 'Surgical Gloves (Box of 100)',
    //     actionType: 'stock-out',
    //     timestamp: new Date('2023-11-15T10:45:00'),
    //     userId: '2',
    //     userName: 'Warehouse Manager',
    //     details: {
    //         oldValue: {
    //             stockLevel: 20
    //         },
    //         newValue: {
    //             stockLevel: 8
    //         },
    //         quantity: 12,
    //         reference: 'Order #2'
    //     }
    // },
    // {
    //     id: '4',
    //     productId: '3',
    //     productName: 'Digital Thermometer',
    //     actionType: 'stock-in',
    //     timestamp: new Date('2023-11-18T09:20:00'),
    //     userId: '1',
    //     userName: 'Admin User',
    //     details: {
    //         oldValue: {
    //             stockLevel: 60
    //         },
    //         newValue: {
    //             stockLevel: 72
    //         },
    //         quantity: 12,
    //         reference: 'Supplier Shipment #TH-452'
    //     }
    // },
    // {
    //     id: '5',
    //     productId: '5',
    //     productName: 'Stethoscope',
    //     actionType: 'update',
    //     timestamp: new Date('2023-11-20T13:40:00'),
    //     userId: '1',
    //     userName: 'Admin User',
    //     details: {
    //         oldValue: {
    //             stockLevel: 15,
    //             price: 3000
    //         },
    //         newValue: {
    //             stockLevel: 15,
    //             price: 3200
    //         }
    //     }
    // },
    // {
    //     id: '6',
    //     productId: '4',
    //     productName: 'Disposable Syringes (Pack of 50)',
    //     actionType: 'stock-out',
    //     timestamp: new Date('2023-11-25T11:15:00'),
    //     userId: '2',
    //     userName: 'Warehouse Manager',
    //     details: {
    //         oldValue: {
    //             stockLevel: 33
    //         },
    //         newValue: {
    //             stockLevel: 23
    //         },
    //         quantity: 10,
    //         reference: 'Order #1'
    //     }
    // },
    // {
    //     id: '7',
    //     productId: '2',
    //     productName: 'Surgical Gloves (Box of 100)',
    //     actionType: 'stock-in',
    //     timestamp: new Date('2023-11-28T08:30:00'),
    //     userId: '2',
    //     userName: 'Warehouse Manager',
    //     details: {
    //         oldValue: {
    //             stockLevel: 8
    //         },
    //         newValue: {
    //             stockLevel: 28
    //         },
    //         quantity: 20,
    //         reference: 'Emergency Stock Replenishment'
    //     }
    // },
    // {
    //     id: '8',
    //     productId: '3',
    //     productName: 'Digital Thermometer',
    //     actionType: 'stock-out',
    //     timestamp: new Date('2023-11-30T14:20:00'),
    //     userId: '2',
    //     userName: 'Warehouse Manager',
    //     details: {
    //         oldValue: {
    //             stockLevel: 72
    //         },
    //         newValue: {
    //             stockLevel: 64
    //         },
    //         quantity: 8,
    //         reference: 'Order #3'
    //     }
    // }
];
