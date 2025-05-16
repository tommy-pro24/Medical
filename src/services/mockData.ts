
import { Product, Order, User, DeliveryUpdate } from '../types';

// Mock Users
export const users: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@ssb.com', role: 'admin' },
    { id: '2', name: 'Warehouse Manager', email: 'warehouse@ssb.com', role: 'warehouse' },
    { id: '3', name: 'ABC Hospital', email: 'client@hospital.com', role: 'client' },
    { id: '4', name: 'Logistics Coordinator', email: 'logistics@ssb.com', role: 'logistics' },
];

// Mock Products
export const products: Product[] = [
    {
        id: '1',
        name: 'Blood Glucose Monitor',
        category: 'diagnostic',
        description: 'Reliable device for measuring blood glucose levels',
        price: 2500,
        stockLevel: 45,
        lowStockThreshold: 10,
        batchNumber: 'BG2023-05',
        expiryDate: new Date('2025-06-15'),
        image: 'https://placehold.co/200x200?text=Blood+Glucose+Monitor',
    },
    {
        id: '2',
        name: 'Surgical Gloves (Box of 100)',
        category: 'surgical',
        description: 'Sterile latex gloves for medical procedures',
        price: 1200,
        stockLevel: 8,
        lowStockThreshold: 20,
        batchNumber: 'SG2023-12',
        expiryDate: new Date('2026-01-30'),
        image: 'https://placehold.co/200x200?text=Surgical+Gloves',
    },
    {
        id: '3',
        name: 'Digital Thermometer',
        category: 'diagnostic',
        description: 'Quick and accurate temperature measurement',
        price: 850,
        stockLevel: 72,
        lowStockThreshold: 15,
        batchNumber: 'DT2023-09',
        expiryDate: new Date('2027-10-22'),
        image: 'https://placehold.co/200x200?text=Digital+Thermometer',
    },
    {
        id: '4',
        name: 'Disposable Syringes (Pack of 50)',
        category: 'consumable',
        description: 'Sterile syringes for single use',
        price: 680,
        stockLevel: 23,
        lowStockThreshold: 25,
        batchNumber: 'DS2023-07',
        expiryDate: new Date('2025-05-18'),
        image: 'https://placehold.co/200x200?text=Disposable+Syringes',
    },
    {
        id: '5',
        name: 'Stethoscope',
        category: 'diagnostic',
        description: 'Professional grade acoustic medical device',
        price: 3200,
        stockLevel: 15,
        lowStockThreshold: 5,
        batchNumber: 'ST2023-06',
        expiryDate: new Date('2030-12-31'),
        image: 'https://placehold.co/200x200?text=Stethoscope',
    },
];

// Mock Orders
export const orders: Order[] = [
    {
        id: '1',
        clientId: '3',
        clientName: 'ABC Hospital',
        orderDate: new Date('2023-11-15'),
        status: 'confirmed',
        invoiceStatus: 'paid',
        items: [
            {
                productId: '1',
                productName: 'Blood Glucose Monitor',
                quantity: 5,
                unitPrice: 2500,
                totalPrice: 12500,
            },
            {
                productId: '4',
                productName: 'Disposable Syringes (Pack of 50)',
                quantity: 10,
                unitPrice: 680,
                totalPrice: 6800,
            }
        ],
        deliveryAgent: 'John Smith',
        deliveryDate: new Date('2023-11-18'),
        totalAmount: 19300,
    },
    {
        id: '2',
        clientId: '3',
        clientName: 'ABC Hospital',
        orderDate: new Date('2023-11-28'),
        status: 'in-transit',
        invoiceStatus: 'invoice-confirmed',
        items: [
            {
                productId: '2',
                productName: 'Surgical Gloves (Box of 100)',
                quantity: 15,
                unitPrice: 1200,
                totalPrice: 18000,
            }
        ],
        deliveryAgent: 'Maria Johnson',
        estimatedDeliveryTime: new Date('2023-12-02'),
        totalAmount: 18000,
    },
    {
        id: '3',
        clientId: '3',
        clientName: 'ABC Hospital',
        orderDate: new Date('2023-11-30'),
        status: 'confirmed',
        invoiceStatus: 'proforma-sent',
        items: [
            {
                productId: '3',
                productName: 'Digital Thermometer',
                quantity: 8,
                unitPrice: 850,
                totalPrice: 6800,
            },
            {
                productId: '5',
                productName: 'Stethoscope',
                quantity: 3,
                unitPrice: 3200,
                totalPrice: 9600,
            }
        ],
        totalAmount: 16400,
    },
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
