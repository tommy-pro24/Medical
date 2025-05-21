import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, ShoppingCart, History } from 'lucide-react';
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useData } from "@/context/DataContext";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { request } from "@/lib/request";
import ProductItem from "@/components/inventory/product";
import { useWebSocketContext } from "@/context/WebSocketContext";
import NewOrder from "@/components/inventory/newOrder";
import Link from "next/link";

interface InventoryProps {
    initialProducts?: Product[];
}

const Inventory = ({ initialProducts }: InventoryProps) => {
    const { getProducts, updateProduct, setAllProduct, getCurrentUser } = useData();
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});

    const { sendMessage } = useWebSocketContext();

    const allProducts = getProducts();
    const products = initialProducts || allProducts;
    const currentUser = getCurrentUser();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        onLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onLoad = async () => {
        try {
            const data = await request({
                method: 'POST',
                url: '/product/getAllProduct',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!data) return;
            setAllProduct(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    }

    const handleUpdateStock = (productId: string, newStock: number) => {
        try {
            if (newStock === 0) {
                toast({
                    title: "Stock info",
                    description: `No stock number`,
                });
            }

            request({
                method: 'POST',
                url: "/product/updateStock",
                data: {
                    id: productId,
                    newStock: newStock
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            });

            const product = products.find(p => p._id === productId);

            if (product) {
                updateProduct({
                    ...product,
                    stockNumber: newStock
                });
                toast({
                    title: "Stock Updated",
                    description: `${product.name} stock level updated to ${newStock}`,
                });
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setDialogOpen(true);
    };

    const handleSelectProduct = (productId: string) => {
        setSelectedProducts(prev => {
            if (prev[productId]) {
                // Deselect
                const newSelected = { ...prev };
                delete newSelected[productId];
                return newSelected;
            } else {
                // Select with default quantity 1
                return { ...prev, [productId]: 1 };
            }
        });
    };

    const handleProductQuantityChange = (productId: string, quantity: number) => {
        if (quantity <= 0) return;
        setSelectedProducts(prev => ({ ...prev, [productId]: quantity }));
    };

    const handlePlaceOrder = async () => {
        if (!currentUser) return;
        if (selectedProducts.length === 0) {
            toast({
                title: 'Order Error',
                description: 'Please select at least one product',
                variant: 'destructive'
            });
            return;
        }

        for (const [productId, quantity] of Object.entries(selectedProducts)) {
            const product = products.find(p => p._id === productId);
            if (product && quantity > product.stockNumber) {
                toast({
                    title: "Info",
                    description: `Insufficient stock for "${product.name}". Available: ${product.stockNumber}`
                })
                return;
            }
        }

        for (const [productId, quantityStr] of Object.entries(selectedProducts)) {
            const quantity = Number(quantityStr);
            const product = products.find(p => p._id === productId);

            if (product) {
                updateProduct({
                    ...product,
                    stockNumber: product.stockNumber - quantity,
                });
            }
        }


        sendMessage({
            type: "SET_NEW_ORDER",
            payload: {
                products: Object.entries(selectedProducts).map(([productId, quantity]) => {
                    const product = products.find(p => p._id === productId);
                    return {
                        productId: product?._id,
                        productName: product?.name || '',
                        quantity,
                        unitPrice: product?.price || 0,
                    };
                }),
                token: getCurrentUser()?.token
            },
            timestamp: Date.now(),
        })

        toast({
            title: 'Order Created',
            description: `Your order has been created successfully`
        });

        setSelectedProducts({});

        setOrderDialogOpen(false);
    };

    const totalOrderAmount = Object.entries(selectedProducts).reduce((sum, [productId, quantity]) => sum + (products.find(p => p._id === productId)?.price || 0) * quantity, 0);

    const totalOrderCount = Object.entries(selectedProducts).reduce(
        (sum, [, quantity]) => sum + quantity,
        0
    );

    const totalOrderType = Object.entries(selectedProducts).length;

    return (
        <div className="space-y-6 w-full py-4 px-4 sm:px-6 md:px-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                {/* Only show Add New Product for non-client */}
                {getCurrentUser()?.role !== 'client' &&
                    <Button variant="outline" asChild>
                        <Link href="/histories" className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            View History
                        </Link>
                    </Button>

                }
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {currentUser?.role === 'admin' && (
                    <Button onClick={handleAddProduct} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Product
                    </Button>
                )}
                {/* Show Order button for client */}
                {currentUser?.role === 'client' && (
                    <Button
                        onClick={() => setOrderDialogOpen(true)}
                        className="w-full sm:w-auto"
                        disabled={Object.keys(selectedProducts).length === 0}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                    const isSelected = !!selectedProducts[product._id];
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <ProductItem
                            key={product._id}
                            product={product}
                            isSelected={isSelected}
                            currentUser={currentUser}
                            handleSelectProduct={handleSelectProduct}
                            selectedProducts={selectedProducts}
                            productCounts={productCounts}
                            setProductCounts={setProductCounts}
                            handleUpdateStock={handleUpdateStock}
                            handleProductQuantityChange={handleProductQuantityChange}
                            handleEditProduct={handleEditProduct}
                        />
                    );
                })}
            </div>
            {currentUser?.role === 'client' && (
                <NewOrder
                    orderDialogOpen={orderDialogOpen}
                    setOrderDialogOpen={setOrderDialogOpen}
                    selectedProducts={selectedProducts}
                    products={products}
                    handleProductQuantityChange={handleProductQuantityChange}
                    totalOrderAmount={totalOrderAmount}
                    totalOrderCount={totalOrderCount}
                    totalOrderType={totalOrderType}
                    handlePlaceOrder={handlePlaceOrder}
                />
            )}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                    </DialogHeader>
                    <ProductForm
                        product={selectedProduct}
                        onClose={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

const ProductForm: React.FC<{
    product: Product | null;
    onClose: () => void;
}> = ({ product, onClose }) => {

    const { addProduct, updateProduct, getCurrentUser } = useData();

    const [name, setName] = useState(product?.name || '');

    const [category, setCategory] = useState<Product['category']>(product?.category || 'diagnostic');

    const [description, setDescription] = useState(product?.description || '');

    const [price, setPrice] = useState(product?.price?.toString() || '');

    const [stockLevel, setStockLevel] = useState(product?.stockNumber?.toString() || '');

    const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold?.toString() || '');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !category || !description || !price || !stockLevel || !lowStockThreshold) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        const productData = {
            _id: product?._id,
            name,
            category,
            description,
            price: parseFloat(price),
            stockNumber: parseInt(stockLevel),
            lowStockThreshold: parseInt(lowStockThreshold)
        };

        request({
            method: "POST",
            url: '/product/updateProduct',
            data: productData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCurrentUser()?.token}`
            }
        })

        if (product) {
            updateProduct({
                ...product,
                ...productData
            });
            toast({
                title: "Product Updated",
                description: `${name} has been updated successfully`
            });
        } else {

            try {

                const data = await request({
                    method: "POST",
                    url: '/product/addNewProduct',
                    data: productData,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCurrentUser()?.token}`
                    }
                });

                if (!data) return;

                productData._id = data._id;

                addProduct(productData);

                toast({
                    title: "Product Added",
                    description: `${name} has been added to inventory`
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error.message);
            }
        }

        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Product['category'])}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="diagnostic">Diagnostic</option>
                    <option value="surgical">Surgical</option>
                    <option value="consumable">Consumable</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price (₹)</label>
                    <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="stockLevel" className="text-sm font-medium">Current Stock</label>
                    <Input
                        id="stockLevel"
                        type="number"
                        value={stockLevel}
                        onChange={(e) => setStockLevel(e.target.value)}
                        placeholder="Enter stock level"
                        min="0"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="lowStockThreshold" className="text-sm font-medium">Low Stock Alert Threshold</label>
                <Input
                    id="lowStockThreshold"
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    placeholder="Enter threshold"
                    min="1"
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">
                    {product ? 'Update Product' : 'Add Product'}
                </Button>
            </div>
        </form>
    );
};

export default Inventory;
