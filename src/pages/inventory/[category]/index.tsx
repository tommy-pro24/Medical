import { useData } from "@/context/DataContext";
import Inventory from "@/components/inventory/Inventory";
import { useRouter } from "next/router";

const CategoryInventory = () => {
    const { getProducts } = useData();
    const router = useRouter();
    const { category } = router.query;
    const pathname = router.pathname;

    // If we're on the main inventory page, treat it as 'all' category
    const currentCategory = pathname === '/inventory' ? 'all' : category;

    const validCategories = ['all', 'diagnostic', 'surgical', 'consumable'];

    if (!currentCategory || !validCategories.includes(currentCategory as string)) {
        return <div>Invalid category</div>;
    }

    const products = currentCategory === 'all'
        ? getProducts()
        : getProducts().filter(product => product.category === currentCategory);

    return <Inventory initialProducts={products} />;
};

export default CategoryInventory;