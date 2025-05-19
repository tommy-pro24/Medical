import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Search, Plus, AlertTriangle, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { request } from "@/lib/request";

interface InventoryProps {
    initialProducts?: Product[];
}

const Inventory = ({ initialProducts }: InventoryProps) => {
    const { getProducts, updateProduct, setAllProduct, getCurrentUser, addOrder } = useData();
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});

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

    const handlePlaceOrder = () => {
        if (!currentUser) return;
        if (selectedProducts.length === 0) {
            toast({
                title: 'Order Error',
                description: 'Please select at least one product',
                variant: 'destructive'
            });
            return;
        }
        const newOrder = addOrder({
            clientId: currentUser._id,
            clientName: currentUser.name,
            items: Object.entries(selectedProducts).map(([productId, quantity]) => ({
                productId,
                productName: products.find(p => p._id === productId)?.name || '',
                quantity,
                unitPrice: products.find(p => p._id === productId)?.price || 0
            }))
        });
        toast({
            title: 'Order Created',
            description: `Your order #${newOrder.id} has been created successfully`
        });
        setSelectedProducts({});
        setOrderDialogOpen(false);
    };

    const totalOrderAmount = Object.entries(selectedProducts).reduce((sum, [productId, quantity]) => sum + (products.find(p => p._id === productId)?.price || 0) * quantity, 0);

    return (
        <div className="space-y-6 w-full py-4 px-4 sm:px-6 md:px-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                {/* Only show Add New Product for non-client */}
                {currentUser?.role !== 'client' && (
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                    const isSelected = !!selectedProducts[product._id];
                    return (
                        <Card
                            key={product._id}
                            className={`overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-blue-500 ring-2 ring-blue-400' : product.stockNumber <= product.lowStockThreshold ? 'border-amber-500/50' : 'border-input'}`}
                            onClick={() => currentUser?.role === 'client' && handleSelectProduct(product._id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {product.name}
                                        {isSelected && (
                                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" title="Selected"></span>
                                        )}
                                    </CardTitle>
                                    {product.stockNumber <= product.lowStockThreshold && (
                                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground capitalize">{product.category}</div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-5 w-5 text-muted-foreground" />
                                        <span>Stock Level:</span>
                                    </div>
                                    <div
                                        className={`font-medium ${product.stockNumber <= product.lowStockThreshold ? 'text-amber-500' : 'text-foreground'}`}
                                    >
                                        {product.stockNumber} units
                                    </div>
                                </div>
                                <div className="text-sm">{product.description}</div>
                                <div className="pt-2 flex justify-between gap-2">
                                    {/* For client: show quantity input only if selected, no Add to Order button */}
                                    {currentUser?.role === 'client' ? (
                                        <Input
                                            type="number"
                                            value={selectedProducts[product._id] || ''}
                                            onChange={e => handleProductQuantityChange(product._id, Number(e.target.value))}
                                            placeholder="Qty"
                                            min="1"
                                            disabled={!isSelected}
                                            onClick={e => e.stopPropagation()}
                                            className={isSelected ? '' : 'opacity-50'}
                                        />
                                    ) : (
                                        <>
                                            <Input
                                                type="number"
                                                value={productCounts[product._id] || 0}
                                                onChange={(e) => setProductCounts(prev => ({
                                                    ...prev,
                                                    [product._id]: Number(e.target.value)
                                                }))}
                                                placeholder="Enter quantity"
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => handleUpdateStock(product._id, product.stockNumber + (productCounts[product._id] || 0))}
                                                className="flex-1"
                                            >
                                                Add
                                            </Button>
                                        </>
                                    )}
                                </div>
                                {/* Only show Edit Product for non-client */}
                                {currentUser?.role !== 'client' && (
                                    <div className="pt-2">
                                        <Button
                                            variant="secondary"
                                            className="w-full"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            Edit Product
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            {/* Order Confirmation Dialog for client */}
            {currentUser?.role === 'client' && (
                <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Order Summary</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="max-h-[400px] overflow-y-auto pr-2">
                                {Object.entries(selectedProducts).map(([productId, quantity]) => {
                                    const product = products.find(p => p._id === productId);
                                    return product ? (
                                        <div
                                            key={productId}
                                            className="flex items-center justify-between border-b border-border py-3"
                                        >
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Unit Price: ₹{product.price.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProductQuantityChange(productId, Math.max(1, quantity - 1));
                                                        }}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="px-3 min-w-[40px] text-center">
                                                        {quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProductQuantityChange(productId, quantity + 1);
                                                        }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                                <div className="font-medium">
                                                    ₹{(product.price * quantity).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                            <div className="border-t border-border pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="font-medium text-lg">₹{totalOrderAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setOrderDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handlePlaceOrder} disabled={Object.keys(selectedProducts).length === 0}>
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Place Order
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {/* Product Form Dialog for non-client */}
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
