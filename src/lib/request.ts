import { toast } from "@/hooks/use-toast"
import api from "./axios"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = async <T = any>(
    config: Parameters<typeof api.request>[0],
    options?: {
        successMessage?: string
        errorMessage?: string
        showToast?: boolean
    }
): Promise<T | null> => {
    try {
        const res = await api.request(config);

        if (options?.successMessage) {
            toast({
                title: "Success",
                description: options.successMessage,
                variant: "success"
            })
        }

        return res.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

        const description =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Something went wrong."

        // Show toast by default unless explicitly disabled
        if (options?.showToast !== false) {
            toast({
                title: "Error",
                description,
                variant: "destructive",
            })
        }

        return null
    }
}
