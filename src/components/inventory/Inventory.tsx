import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useData } from "@/context/DataContext";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { request } from "@/lib/request";
import NewOrder from "@/components/inventory/newOrder";
import InventoryHeader from '@/components/inventory/InventoryHeader';
import ProductGrid from '@/components/inventory/ProductGrid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocketContext } from "@/context/WebSocketContext";

interface InventoryProps {
    initialProducts?: Product[];
}

const Inventory = ({ initialProducts }: InventoryProps) => {
    const { getProducts, updateProduct, getCurrentUser, getSelectedProducts, updateSelectedProduct, setSelectedProductsState } = useData();
    const { sendMessage } = useWebSocketContext();
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const allProducts = getProducts();
    const products = initialProducts || allProducts;
    const currentUser = getCurrentUser();
    const selectedProducts = getSelectedProducts();

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
    );

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
        const currentQuantity = selectedProducts[productId];
        updateSelectedProduct(productId, currentQuantity ? undefined : 1);
    };

    const handleProductQuantityChange = (productId: string, quantity: number | string) => {
        if (quantity === '' || quantity === 0 || quantity === '0') {
            updateSelectedProduct(productId);
            return;
        }
        updateSelectedProduct(productId, Number(quantity));
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

        setSelectedProductsState({});
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
            <InventoryHeader
                search={search}
                setSearch={setSearch}
                currentUserRole={currentUser?.role || ''}
                onAddProduct={handleAddProduct}
                onOrder={() => setOrderDialogOpen(true)}
                orderDisabled={Object.keys(selectedProducts).length === 0}
                selectedProductsCount={Object.keys(selectedProducts).length}
            />
            <ProductGrid
                products={filteredProducts}
                selectedProducts={selectedProducts}
                productCounts={productCounts}
                setProductCounts={setProductCounts}
                currentUser={currentUser}
                handleSelectProduct={handleSelectProduct}
                handleUpdateStock={handleUpdateStock}
                handleProductQuantityChange={handleProductQuantityChange}
                handleEditProduct={handleEditProduct}
            />
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
    const [category, setCategory] = useState<string>(product?.category || '');
    const [description, setDescription] = useState(product?.description || '');
    const [price, setPrice] = useState(product?.price?.toString() || '');
    const [stockLevel, setStockLevel] = useState(product?.stockNumber?.toString() || '');
    const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold?.toString() || '');
    const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await request({
                url: '/category/getAllCategories',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            });
            if (response && Array.isArray(response.data)) {
                setCategories(response.data);
            }
        };
        fetchCategories();
    }, [getCurrentUser]);

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
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
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
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && price === '0') {
                                e.preventDefault();
                                setPrice('');
                            }
                        }}
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
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && stockLevel === '0') {
                                e.preventDefault();
                                setStockLevel('');
                            }
                        }}
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