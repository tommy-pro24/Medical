import Cookies from "js-cookie"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storeUserInfo = (userData: Record<string, any>) => {

    try {

        Object.entries(userData).forEach(([key, value]) => {

            const stringValue = typeof value === "string" ? value : JSON.stringify(value)

            Cookies.set(key, stringValue, {
                expires: 7,
                path: "/",
            })
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

        console.log(error.message);

    }

}


export const removeCookies = () => {

    try {

        const allCookies = Cookies.get();

        Object.keys(allCookies).forEach(cookieName => {
            Cookies.remove(cookieName, { path: '' });
            Cookies.remove(cookieName, { path: '/' });
        });

        window.location.href = '/';

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {

    }

}