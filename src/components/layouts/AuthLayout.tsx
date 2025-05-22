import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useData } from '@/context/DataContext';
import { request } from '@/lib/request';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { toast } from '@/hooks/use-toast';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const router = useRouter();
    const { login, getCurrentUser, addOrder, setNewOrders, getNewOrders, updateOrderStatus } = useData();
    const { lastMessage } = useWebSocketContext();

    useEffect(() => {
        const checkAuth = async () => {
            const userId = Cookies.get('id');
            const currentUser = getCurrentUser();

            // If no user ID in cookies, redirect to login
            if (!userId && !router.pathname.includes('/login/')) {
                router.push('/login/signin');
                return;
            }

            // If we have a user ID but no current user data, fetch the profile
            if (userId && !currentUser) {
                try {
                    const response = await request({
                        method: "POST",
                        url: '/auth/profile',
                        data: {
                            id: userId
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response) {
                        login(response.user);
                        setNewOrders(response?.count);
                    } else {
                        // If profile fetch fails, redirect to login
                        router.push('/login/signin');
                    }
                } catch (error) {
                    console.error('Auth check failed:', error);
                    router.push('/login/signin');
                }
            }
        };

        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, login, getCurrentUser]);

    const newOrder = () => {
        if ((getCurrentUser()?._id === lastMessage?.payload?.clientId) || (getCurrentUser()?.role !== 'client')) {

            addOrder(lastMessage?.payload);

            if (getCurrentUser()?.role === 'admin') {
                setNewOrders(getNewOrders() + 1);
                toast({
                    title: 'Order Created',
                    description: `New order has been received.`
                });
            }

        }
    }

    const setDispatch = () => {

        if ((getCurrentUser()?._id === lastMessage?.payload?.userId) || (getCurrentUser()?.role !== 'client')) {

            updateOrderStatus(lastMessage?.payload?.orderId, lastMessage?.payload?.newStatus);

            if (lastMessage?.payload?.newStatus === 'dispatched') {
                if (getCurrentUser()?.role === 'admin') {
                    setNewOrders(getNewOrders() - 1);
                } else {
                    setNewOrders(getNewOrders() + 1);
                }
            } else if (lastMessage?.payload?.newStatus === 'in-transit') {
                setNewOrders(getNewOrders() - 1);
            }



        }
    }

    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.type === 'NEW_ORDER') newOrder();
            else if (lastMessage.type === "SET_DISPATCHED") setDispatch()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastMessage])

    return <>{children}</>;
};

export default AuthLayout;