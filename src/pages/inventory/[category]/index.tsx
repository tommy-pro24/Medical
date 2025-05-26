import { useEffect, useState } from 'react';
import { useData } from "@/context/DataContext";
import Inventory from "@/components/inventory/Inventory";
import { useRouter } from "next/router";
import { request } from "@/lib/request";

interface Category {
    _id: string;
    name: string;
    description?: string;
}

const CategoryInventory = () => {
    const { getProducts, getCurrentUser } = useData();
    const router = useRouter();
    const { category } = router.query;
    const pathname = router.pathname;
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // If we're on the main inventory page, treat it as 'all' category
    const currentCategory = pathname === '/inventory' ? 'all' : category;

    useEffect(() => {
        const fetchCategories = async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await request<Category[]>({
                url: '/category/getAllCategories',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            });
            setCategories(response.data);
            setLoading(false);
        };
        if (getCurrentUser()) fetchCategories();
    }, [getCurrentUser]);

    const validCategories = ['all', ...(Array.isArray(categories) ? categories.map(cat => cat._id) : [])];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentCategory || !validCategories.includes(currentCategory as string)) {
        return <div>Invalid category</div>;
    }

    const products = currentCategory === 'all'
        ? getProducts()
        : getProducts().filter(product => product.category === currentCategory);

    return <Inventory initialProducts={products} />;
};

export default CategoryInventory;