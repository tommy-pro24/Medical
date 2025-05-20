
import { Product, Order, User, DeliveryUpdate } from '../types';

// Mock Users
export const users: User[] = [];

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
