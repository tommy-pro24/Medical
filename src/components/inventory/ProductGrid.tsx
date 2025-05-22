import React from 'react';
import { Product } from '@/types';
import ProductItem from './product';

interface ProductGridProps {
    products: Product[];
    selectedProducts: Record<string, number>;
    productCounts: Record<string, number>;
    setProductCounts: (v: Record<string, number>) => void;
    currentUser: unknown;
    handleSelectProduct: (id: string) => void;
    handleUpdateStock: (id: string, stock: number) => void;
    handleProductQuantityChange: (id: string, qty: number) => void;
    handleEditProduct: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    selectedProducts,
    productCounts,
    setProductCounts,
    currentUser,
    handleSelectProduct,
    handleUpdateStock,
    handleProductQuantityChange,
    handleEditProduct,
}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
            <ProductItem
                key={product._id}
                product={product}
                isSelected={!!selectedProducts[product._id]}
                currentUser={currentUser}
                handleSelectProduct={handleSelectProduct}
                selectedProducts={selectedProducts}
                productCounts={productCounts}
                setProductCounts={setProductCounts}
                handleUpdateStock={handleUpdateStock}
                handleProductQuantityChange={handleProductQuantityChange}
                handleEditProduct={handleEditProduct}
            />
        ))}
    </div>
);

export default ProductGrid; 