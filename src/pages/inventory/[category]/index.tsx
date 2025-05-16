import { useData } from "@/context/DataContext";
import Inventory from "..";
import { useRouter } from "next/router";


const CategoryInventory = () => {

    const { getProducts } = useData();

    const router = useRouter();

    const { category } = router.query;

    const validCategories = ['all', 'diagnostic', 'surgical', 'consumable'];

    if (!category || !validCategories.includes(category as string)) {
        return <div>Invalid category</div>;
    }

    const products = category === 'all'
        ? getProducts()
        : getProducts().filter(product => product.category === category);

    return <Inventory initialProducts={products} />;
};

export default CategoryInventory;