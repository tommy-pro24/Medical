import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CatchAllRoute = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return null;
};

export default CatchAllRoute;