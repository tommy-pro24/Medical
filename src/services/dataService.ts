
import { SetStateAction, useState } from 'react';
import { Product, Order, User, OrderItem, DeliveryUpdate, StockTransaction } from '../types';
import { products as mockProducts, orders as mockOrders, users as mockUsers, deliveryUpdates as mockDeliveryUpdates } from './mockData';

// Create a simple in-memory data store
const useDataStore = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [users] = useState<User[]>(mockUsers);
    const [deliveryUpdates, setDeliveryUpdates] = useState<DeliveryUpdate[]>(mockDeliveryUpdates);
    const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // Default to admin for demo

    // Product Operations
    const getProducts = () => products;

    const getProduct = (id: string) => products.find((p) => p._id === id);

    const setAllProduct = (products: SetStateAction<Product[]>) => {
        setProducts(products);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addProduct = (product: any) => {
        setProducts([...products, product as Product]);
        return product;
    };

    const updateProduct = async (product: Product) => {
        try {


            setProducts(products.map((p) => (p._id === product._id ? product : p)));

            return product;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);
        }
    };


    const deleteProduct = (id: string) => {
        setProducts(products.filter((p) => p._id !== id));
    };

    const getLowStockProducts = () => {
        return products.filter((p) => p.stockNumber <= p.lowStockThreshold);
    };

    // Order Operations
    const getOrders = () => orders;

    const getOrder = (id: string) => orders.find((o) => o.id === id);

    const addOrder = (orderData: {
        clientId: string;
        clientName: string;
        items: Omit<OrderItem, 'totalPrice'>[];
    }) => {
        const orderItems: OrderItem[] = orderData.items.map((item) => ({
            ...item,
            totalPrice: item.quantity * item.unitPrice,
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

        const newOrder: Order = {
            id: `${orders.length + 1}`,
            clientId: orderData.clientId,
            clientName: orderData.clientName,
            orderDate: new Date(),
            status: 'pending',
            items: orderItems,
            invoiceStatus: 'draft',
            totalAmount,
        };

        setOrders([...orders, newOrder]);

        // Add initial delivery update
        const newDeliveryUpdate: DeliveryUpdate = {
            id: `${deliveryUpdates.length + 1}`,
            orderId: newOrder.id,
            status: 'pending',
            timestamp: new Date(),
            note: 'Order received',
            updatedBy: 'System',
        };
        setDeliveryUpdates([...deliveryUpdates, newDeliveryUpdate]);

        // Update stock levels
        orderItems.forEach((item) => {
            const product = products.find((p) => p._id === item.productId);
            if (product) {
                const updatedProduct = {
                    ...product,
                    stockLevel: product.stockNumber - item.quantity,
                };
                updateProduct(updatedProduct);

                // Record stock transaction
                const stockTransaction: StockTransaction = {
                    id: `${stockTransactions.length + 1}`,
                    productId: item.productId,
                    type: 'out',
                    quantity: item.quantity,
                    date: new Date(),
                    reference: `Order #${newOrder.id}`,
                };
                setStockTransactions([...stockTransactions, stockTransaction]);
            }
        });

        return newOrder;
    };

    const updateOrderStatus = (id: string, status: Order['status']) => {
        setOrders(
            orders.map((o) => (o.id === id ? { ...o, status } : o))
        );

        // Add delivery update
        const newDeliveryUpdate: DeliveryUpdate = {
            id: `${deliveryUpdates.length + 1}`,
            orderId: id,
            status: status as DeliveryUpdate['status'],
            timestamp: new Date(),
            note: `Order status updated to ${status}`,
            updatedBy: currentUser?.name || 'System',
        };

        setDeliveryUpdates([...deliveryUpdates, newDeliveryUpdate]);
    };

    const updateInvoiceStatus = (id: string, invoiceStatus: Order['invoiceStatus']) => {
        setOrders(
            orders.map((o) => (o.id === id ? { ...o, invoiceStatus } : o))
        );
    };

    // User Operations
    const getUsers = () => users;

    const getUser = (id: string) => users.find((u) => u.id === id);

    const login = (email: string) => {
        const user = users.find((u) => u.email === email);
        if (user) {
            setCurrentUser(user);
            return user;
        }
        return null;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const getCurrentUser = () => currentUser;

    // Delivery Updates
    const getDeliveryUpdates = (orderId: string) => {
        return deliveryUpdates.filter((du) => du.orderId === orderId);
    };

    const addDeliveryUpdate = (update: Omit<DeliveryUpdate, 'id'>) => {
        const newUpdate = {
            ...update,
            id: `${deliveryUpdates.length + 1}`,
            timestamp: new Date(),
        };

        setDeliveryUpdates([...deliveryUpdates, newUpdate]);

        // Update order status
        updateOrderStatus(update.orderId, update.status);

        return newUpdate;
    };

    // Stock Transactions
    const getStockTransactions = (productId?: string) => {
        if (productId) {
            return stockTransactions.filter((st) => st.productId === productId);
        }
        return stockTransactions;
    };

    const addStockTransaction = (transaction: Omit<StockTransaction, 'id' | 'date'>) => {
        const newTransaction = {
            ...transaction,
            id: `${stockTransactions.length + 1}`,
            date: new Date(),
        };

        setStockTransactions([...stockTransactions, newTransaction]);

        // Update product stock level
        const product = products.find((p) => p._id === transaction.productId);
        if (product) {
            const updatedStockLevel = transaction.type === 'in'
                ? product.stockNumber + transaction.quantity
                : product.stockNumber - transaction.quantity;

            updateProduct({
                ...product,
                stockLevel: updatedStockLevel,
            });
        }

        return newTransaction;
    };

    return {
        // Product operations
        getProducts,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        getLowStockProducts,
        setAllProduct,

        // Order operations
        getOrders,
        getOrder,
        addOrder,
        updateOrderStatus,
        updateInvoiceStatus,

        // User operations
        getUsers,
        getUser,
        login,
        logout,
        getCurrentUser,

        // Delivery operations
        getDeliveryUpdates,
        addDeliveryUpdate,

        // Stock transactions
        getStockTransactions,
        addStockTransaction,
    };
};

export default useDataStore;
