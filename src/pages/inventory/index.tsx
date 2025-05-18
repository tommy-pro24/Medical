import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Search, Plus, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { request } from "@/lib/request";
import Cookies from "js-cookie";

interface InventoryProps {
    initialProducts?: Product[];
}

const Inventory = ({ initialProducts }: InventoryProps) => {

    const { getProducts, updateProduct, setAllProduct } = useData();

    const [search, setSearch] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);

    const [productCounts, setProductCounts] = useState<Record<string, number>>({});

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const allProducts = getProducts();

    const products = initialProducts || allProducts;

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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);
        }

    }

    const handleUpdateStock = (productId: string, newStock: number) => {

        try {

            request({
                method: 'POST',
                url: "/product/updateStock",
                data: {
                    id: productId,
                    newStock: newStock
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);
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

    return (
        <div className="space-y-6 w-full py-4 px-4 sm:px-6 md:px-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Inventory Management</h1>
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
                <Button onClick={handleAddProduct} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <Card
                        key={product._id}
                        className={`overflow-hidden ${product.stockNumber <= product.lowStockThreshold ? 'border-amber-500/50' : 'border-input'}`}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{product.name}</CardTitle>
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
                                {/* <Button
                                    variant="outline"
                                    onClick={() => handleUpdateStock(product._id, product.stockNumber - 1)}
                                    disabled={product.stockNumber <= 0}
                                    className="flex-1"
                                >
                                    - Stock Out
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleUpdateStock(product._id, product.stockNumber + 1)}
                                    className="flex-1"
                                >
                                    + Stock In
                                </Button> */}
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
                            </div>

                            <div className="pt-2">
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    Edit Product
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
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

    const { addProduct, updateProduct } = useData();

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
            _id: '',
            name,
            category,
            description,
            price: parseFloat(price),
            stockLevel: parseInt(stockLevel),
            lowStockThreshold: parseInt(lowStockThreshold)
        };

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
                        'Authorization': `Bearer ${Cookies.get('token')}`
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
