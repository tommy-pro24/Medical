import CategoryInventory from './[category]';
import { useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { request } from '@/lib/request';

export default function InventoryPage() {

    const { setAllProduct } = useData();

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

    return <CategoryInventory />;
}
