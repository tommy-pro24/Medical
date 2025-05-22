import { SetStateAction, useState } from 'react';
import { Product, Order, User, DeliveryUpdate, StockTransaction, InventoryHistory } from '../types';
import { products as mockProducts, orders as mockOrders, users as mockUsers, deliveryUpdates as mockDeliveryUpdates, inventoryHistory as mockInventoryHistory } from './mockData';

// Create a simple in-memory data store
const useDataStore = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [users] = useState<User[]>(mockUsers);
    const [deliveryUpdates, setDeliveryUpdates] = useState<DeliveryUpdate[]>(mockDeliveryUpdates);
    const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // Default to admin for demo
    const [inventoryHistory, setInventoryHistory] = useState<InventoryHistory[]>(mockInventoryHistory);
    const [newOrders, setNewOrders] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});

    // Product Operations
    const getProducts = () => products;

    const getProduct = (id: string) => products.find((p) => p._id === id);

    const setAllProduct = (products: SetStateAction<Product[]>) => {
        setProducts(products);
    }

    const getSelectedProducts = () => selectedProducts;

    const setSelectedProductsState = (products: Record<string, number>) => {
        setSelectedProducts(products);
    }

    const updateSelectedProduct = (productId: string, quantity?: number) => {
        setSelectedProducts(prev => {
            if (!quantity) {
                const newSelected = { ...prev };
                delete newSelected[productId];
                return newSelected;
            }
            return { ...prev, [productId]: quantity };
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addProduct = (product: any) => {

        setProducts([...products, product as Product]);

        return product;

    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateProduct = async (product: any) => {
        try {


            const oldProduct = products.find(p => p._id === product._id);
            setProducts(products.map((p) => (p._id === product._id ? product : p)));

            // Track product update in history
            if (oldProduct) {
                const historyEntry: InventoryHistory = {
                    id: `${inventoryHistory.length + 1}`,
                    productId: product._id,
                    productName: product.name,
                    actionType: 'update',
                    createdAt: new Date(),
                    userId: currentUser?._id || 'system',
                    userName: currentUser?.name || 'System',
                    details: {
                        oldValue: {
                            stockLevel: oldProduct.stockNumber,
                            price: oldProduct.price
                        },
                        newValue: {
                            stockLevel: product.stockNumber,
                            price: product.price
                        }
                    }
                };
                setInventoryHistory([...inventoryHistory, historyEntry]);
            }

            return product;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);
        }
    };


    const deleteProduct = (id: string) => {
        const productToDelete = products.find(p => p._id === id);
        setProducts(products.filter((p) => p._id !== id));

        // Track product deletion in history
        if (productToDelete) {
            const historyEntry: InventoryHistory = {
                id: `${inventoryHistory.length + 1}`,
                productId: id,
                productName: productToDelete.name,
                actionType: 'delete',
                createdAt: new Date(),
                userId: currentUser?._id || 'system',
                userName: currentUser?.name || 'System',
                details: {
                    oldValue: {
                        stockLevel: productToDelete.stockNumber,
                        price: productToDelete.price
                    }
                }
            };
            setInventoryHistory([historyEntry, ...inventoryHistory]);
        }
    };

    const getLowStockProducts = () => {
        return products.filter((p) => p.stockNumber <= p.lowStockThreshold);
    };

    // Inventory History
    const getInventoryHistory = () => inventoryHistory;

    //set all history

    const setHistories = (histories: SetStateAction<InventoryHistory[]>) => {
        setInventoryHistory(histories);
    }

    // Order Operations
    const getOrders = () => orders;

    const setAllOrders = (orders: SetStateAction<Order[]>) => {

        setOrders(orders);

    }

    const getNewOrders = () => newOrders;

    const getOrder = (id: string) => orders.find((o) => o.id === id);

    const addOrder = (orderData: Order) => {

        setOrders([orderData, ...orders]);

        // Add initial delivery update
        const newDeliveryUpdate: DeliveryUpdate = {
            id: `${deliveryUpdates.length + 1}`,
            orderId: orderData?.id,
            status: 'pending',
            timestamp: new Date(),
            note: 'Order received',
            updatedBy: 'System',
        };
        setDeliveryUpdates([...deliveryUpdates, newDeliveryUpdate]);

        return orderData;
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

    // const updateInvoiceStatus = (id: string, invoiceStatus: Order['invoiceStatus']) => {
    //     setOrders(
    //         orders.map((o) => (o.id === id ? { ...o, invoiceStatus } : o))
    //     );
    // };

    // User Operations
    const getUsers = () => users;

    const getUser = (id: string) => users.find((u) => u._id === id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateUser = (user: any) => {
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                ...user
            };
            setCurrentUser(updatedUser);
            return updatedUser;
        }
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const login = (user: any) => {

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
            createAt: new Date(),
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
            const oldStockLevel = product.stockNumber;
            const updatedStockLevel = transaction.type === 'in'
                ? product.stockNumber + transaction.quantity
                : product.stockNumber - transaction.quantity;

            const updatedProduct = {
                ...product,
                stockNumber: updatedStockLevel,
            };

            updateProduct(updatedProduct);

            // Add inventory history for stock transaction
            const historyEntry: InventoryHistory = {
                id: `${inventoryHistory.length + 1}`,
                productId: product._id,
                productName: product.name,
                actionType: transaction.type === 'in' ? 'stock-in' : 'stock-out',
                createdAt: new Date(),
                userId: currentUser?._id || 'system',
                userName: currentUser?.name || 'System',
                details: {
                    oldValue: { stockLevel: oldStockLevel },
                    newValue: { stockLevel: updatedStockLevel },
                    quantity: transaction.quantity,
                    reference: transaction.reference
                }
            };
            setInventoryHistory([...inventoryHistory, historyEntry]);
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
        getSelectedProducts,
        setSelectedProductsState,
        updateSelectedProduct,

        // Order operations
        getOrders,
        getOrder,
        setNewOrders,
        getNewOrders,
        addOrder,
        setAllOrders,
        updateOrderStatus,
        // updateInvoiceStatus,

        // Inventory history
        getInventoryHistory,
        setHistories,

        // User operations
        getUsers,
        getUser,
        login,
        logout,
        getCurrentUser,
        updateUser,

        // Delivery operations
        getDeliveryUpdates,
        addDeliveryUpdate,

        // Stock transactions
        getStockTransactions,
        addStockTransaction,
    };
};

export default useDataStore;
