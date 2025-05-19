import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useData } from '@/context/DataContext';
import { request } from '@/lib/request';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const router = useRouter();
    const { login, getCurrentUser } = useData();

    useEffect(() => {
        const checkAuth = async () => {
            const userId = Cookies.get('id');
            const currentUser = getCurrentUser();

            // If no user ID in cookies, redirect to login
            if (!userId) {
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
                        login(response);
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
    }, [router, login, getCurrentUser]);

    return <>{children}</>;
};

export default AuthLayout; 